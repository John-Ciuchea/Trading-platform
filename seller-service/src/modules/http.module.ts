import { Module } from '@nestjs/common'
import { DealController } from '../controllers/deal.controller'
import { EventService } from '../services/event.service'
import { NatsJetStreamClientProxy, NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { natsConnectionOptions as connectionOptions } from '../common/config'

@Module({
  imports: [
    NatsJetStreamTransport.register({ connectionOptions }),
  ],
  controllers: [DealController],
  providers: [EventService, NatsJetStreamClientProxy],
})
export class HttpModule {}
