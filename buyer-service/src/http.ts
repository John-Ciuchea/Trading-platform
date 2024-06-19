import { NestFactory } from '@nestjs/core';
import { HttpModule } from './modules/http.module'

const APP_PORT = process.env.APP_PORT || 3001

async function bootstrap() {
  const app = await NestFactory.create(HttpModule);
  await app.listen(APP_PORT);
}

bootstrap().then(() => {
  console.log(`Listening on port ${APP_PORT}`);
});
