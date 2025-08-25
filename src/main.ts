import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
  origin: [
    'https://final-year-project-orpin-six.vercel.app',    // local frontend (React/Next.js)
 // production frontend
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
  
  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📡 WebSocket server is running on ws://localhost:${port}`);
}

bootstrap();
