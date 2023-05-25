import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LoggingService } from "./logging/logging.service";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  app.enableCors({ credentials: true, origin: app.get(ConfigService).get("FRONTEND_URL") });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.use(cookieParser());
  app.useLogger(app.get(LoggingService));
  SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, new DocumentBuilder()
    .setTitle("Restaurant API")
    .setDescription("Restaurant REST API")
    .setVersion("1.0")
    .build()));
  await app.listen(3000);
}

bootstrap();
