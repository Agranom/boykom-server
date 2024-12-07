import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';
import { SocketIoAdapter } from './providers/socket/adapters/socketio.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<AppConfig> = app.get(ConfigService);
  const port = configService.get('port');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    origin: configService.getOrThrow('origin'),
  });
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

  process.on('uncaughtException', (err) => {
    console.error(`globalError - {message ${err.message}, stack - ${err.stack}`, err.name);
  });

  const swaggerBuilder = new DocumentBuilder().setTitle('Boykom').addBearerAuth();

  const swaggerConfig = swaggerBuilder.build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  await app.listen(Number(port));

  console.log(`Server is running on ${port} port`);
}
bootstrap();
