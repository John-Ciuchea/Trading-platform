import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { NatsModule } from './modules/nats.module'
import { natsServerConfig } from './common/config'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NatsModule, {
    strategy: new NatsJetStreamServer(natsServerConfig)
  })
  await app.listen()
}

bootstrap().then(() => {
  console.log('Listener started')
})
