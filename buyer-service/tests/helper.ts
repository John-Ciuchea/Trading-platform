import { Test } from '@nestjs/testing'
import { DealListener } from '../src/listeners/deal.listener'
import { faker } from '@faker-js/faker'
import { CreatedPayload } from '../src/types/deal'
import sellerModel from '../src/models/seller.model'
import dealModel from '../src/models/deal.model'
import { Deal } from '@prisma/client'
import { WebhookService } from '../src/services/webhookService'
import {  NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { natsConnectionOptions as connectionOptions } from '../src/common/config'

export const dealCreatedListener = async () => {
  const mod = await Test.createTestingModule({
    imports: [NatsJetStreamTransport.register({ connectionOptions }),],
    controllers: [DealListener],
    providers: [WebhookService],
  }).compile();

  return mod.get<DealListener>(DealListener);
}

export const createSeller = async () => await sellerModel.create({
  data: { id: faker.string.uuid() }
})

export const createDealAndSeller = async (deal?: Partial<CreatedPayload>) => {
  let sellerId = deal?.sellerId;
  if (!sellerId) {
    sellerId = (await createSeller()).id
  }
  const data = dealData({ ...deal, sellerId })
  return dealModel.create({ data });
}

let seq = 0
export const dealData = (data?: Partial<Deal>): Deal => ({
  id: data?.id ?? faker.string.uuid(),
  name: faker.string.alpha(5),
  totalPrice: 1000,
  currency: 'GBP',
  status: 'sold',
  sellerId: data?.sellerId ?? faker.string.uuid(),
  createdAt: data?.createdAt ?? faker.date.recent(),
  updatedAt: data?.updatedAt ?? faker.date.recent(),
  deliverySequence: data?.deliverySequence ?? seq++,

})
