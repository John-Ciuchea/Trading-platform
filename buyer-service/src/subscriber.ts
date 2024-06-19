import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { natsServerConfig } from './common/config'
import { DealsSubscriberModule } from './modules/deals.subscriber.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(DealsSubscriberModule, {
    strategy: new NatsJetStreamServer(natsServerConfig),
  })
  await app.listen()
}

bootstrap().then(() => {
  console.log('Listener started')
})
