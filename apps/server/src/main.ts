import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import cookieParser from 'cookie-parser'
import settings from './settings'
import { ValidationPipe } from '@nestjs/common';

import 'dotenv/config' 

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  // console.log('DATABASE_URL at runtime =', process.env.DATABASE_URL);

  // middleware 설정 

  app.use(cookieParser()) 

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) // request body로 들어온 데이터의 유효성 검사. DTO가 필요함
  // whitelist : 검증 규칙이 정의되지 않은 프로퍼티를 제거해준다 

  app.enableCors(settings().getCorsConfig()) // enableCors : 서로 다른 출처의 리소스 공유. 이를테면 백엔드-프론트엔드. settings에 그 주소가 저장되어 있다 

  await app.listen(process.env.PORT ?? 8000);

}

bootstrap();
