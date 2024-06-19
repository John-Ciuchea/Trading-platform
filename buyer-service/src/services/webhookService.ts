import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { Injectable } from '@nestjs/common'
import { Deal } from '@prisma/client'
import buyerModel from '../models/buyer.model'
import { getFieldEventTypes } from '../common/utils'

@Injectable()
export class WebhookService {
  constructor(
    private client: NatsJetStreamClientProxy,
  ) {}

  async fireDealCreatedWebhooks(deal: Deal) {
    // TODO: use chunks
    const webhooks = await buyerModel.findDealWebhooks(deal.sellerId, ['deal.*', 'deal.created'])
    webhooks.forEach((webhook) => {
      this.client.emit('webhook.deal.created', { webhook, payload: { deal } })
    })
  }

  async fireDealUpdatedWebhooks(oldDeal: Deal, newDeal: Deal) {
    const modelEventTypes = ['deal.*', 'deal.updated']
    let fieldEventTypes = getFieldEventTypes(oldDeal, newDeal)

    // TODO: use chunks
    const webhooks = await buyerModel.findDealWebhooks(newDeal.sellerId, [...modelEventTypes, ...fieldEventTypes])
    webhooks.forEach((webhook) => {
      let payload = fieldEventTypes.includes(webhook.event)
        ? { was: oldDeal, now: newDeal }
        : { deal: newDeal }
      ;
      this.client.emit(webhook.event, payload)
    })
  }

}
