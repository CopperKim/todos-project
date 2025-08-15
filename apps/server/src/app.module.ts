import { RefreshExpiredFilter } from './module/auth/auth.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TodosModule } from './module/todos/todos.module';
import { AuthModule } from './module/auth/auth.module';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { JwtAccessGuard } from './module/auth/guards/jwt-acess.guard';

@Module({
  imports: [
    AuthModule, 
    TodosModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAccessGuard },
    { provide: APP_FILTER, useClass: RefreshExpiredFilter}, 
    AppService,
  ],
})
export class AppModule {}
