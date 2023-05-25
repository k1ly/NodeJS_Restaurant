import { Module } from "@nestjs/common";
import { LoggingService } from "./logging.service";
import { ConfigModule } from "@nestjs/config";
import { LoggingInterceptor } from "./logging.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [LoggingService, {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor
  }],
  exports: [LoggingService]
})
export class LoggingModule {
}
