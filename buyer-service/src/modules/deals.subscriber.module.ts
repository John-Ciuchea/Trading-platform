import { Module } from '@nestjs/common'
import { DealListener } from '../listeners/deal.listener'
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { natsConnectionOptions as connectionOptions } from '../common/config'
import { WebhookService } from '../services/webhookService'

@Module({
  imports: [
    NatsJetStreamTransport.register({ connectionOptions }),
  ],
  controllers: [DealListener],
  providers: [WebhookService],
})

export class DealsSubscriberModule {}
