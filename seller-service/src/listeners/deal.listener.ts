import { Ctx, EventPattern, Payload } from '@nestjs/microservices'
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { createdSchema } from '../types/deal.types'
import { Controller } from '@nestjs/common'
import dealModel from '../models/deal.model'
import { DealSubject } from '../events/deal.event'

@Controller()
export class DealListener {

  @EventPattern(DealSubject.ALL)
  async persistDeal(
    @Payload() data: any,
    @Ctx() context: NatsJetStreamContext,
  ) {
    const result = createdSchema.safeParse(data)
    if (!result.success) {
      context.message.term()
      return
    }
    try {
      await dealModel.createWithItems(result.data)
      context.message.ack()
    } catch (e) {
      console.error(e)
      context.message.term()
    }
  }
}
