import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import cookieParser from 'cookie-parser'
import settings from './settings'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // middleware 설정 

  app.use(cookieParser()) 

  app.enableCors(settings().getCorsConfig()) // 서로 다른 출처의 리소스 공유. 이를테면 백엔드-프론트엔드. settings에 그 주소가 저장되어 있다 

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
