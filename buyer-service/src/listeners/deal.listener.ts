import { Ctx, EventPattern, Payload } from '@nestjs/microservices'
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { createdSchema } from '../types/deal'
import dealModel from '../models/deal.model'
import { WebhookService } from '../services/webhookService'
import { Controller } from '@nestjs/common'

// TODO: move validation in pipes
@Controller()
export class DealListener {
  constructor(
    private webhooksService: WebhookService,
  ) {}

  @EventPattern('deal.created')
  async handleDealCreated(
    @Payload() payload: unknown,
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    const { success, data } = createdSchema.safeParse(payload)
    if (!success) {
      ctx.message.term()
      return
    }
    const deal = await dealModel.createFromEvent({
      ...data,
      deliverySequence: ctx.getArgByIndex(0).info.deliverySequence,
    })
    if (!deal) {
      ctx.message.term()
      return
    }
    ctx.message.ack()
    console.log('firing webhooks')
    // TODO: put this work on a queue
    await this.webhooksService.fireDealCreatedWebhooks(deal)
  }

  @EventPattern('deal.updated')
  async handleDealUpdated(
    @Payload() payload: unknown,
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    const { success, data } = createdSchema.safeParse(payload)
    if (!success) {
      ctx.message.term()
      return
    }
    const deal = await dealModel.find(data.id)
    if (!deal || deal.updatedAt > data.updatedAt) {
      ctx.message.term()
      return
    }
    const newDeal = await dealModel.updateFromEvent({
      ...data,
      deliverySequence: ctx.getArgByIndex(0).info.deliverySequence,
    })
    if (!newDeal) {
      ctx.message.term()
      return
    }
    ctx.message.ack()
    console.log('firing webhooks')
    // TODO: put this work on a queue
    await this.webhooksService.fireDealUpdatedWebhooks(deal, newDeal)
  }
}
