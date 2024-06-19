import { afterAll, beforeAll, beforeEach } from 'vitest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import supertest from 'supertest'
import TestAgent from 'supertest/lib/agent'
import { HttpModule } from '../src/modules/http.module'
import ApiKeyModel from '../src/models/api-key.model'
import { faker } from '@faker-js/faker'
import { DealListener } from '../src/listeners/deal.listener'
import SellerModel from '../src/models/seller.model'
import { CreatedPayload } from '../src/types/deal.types'
import dealModel from '../src/models/deal.model'

export const useApp = () => {
  let app: INestApplication
  let request: TestAgent

  beforeAll(async () => {
    const testModule = await Test
      .createTestingModule({ imports: [HttpModule] })
      .compile()

    app = testModule.createNestApplication()
    await app.init()
  })

  beforeEach(() => {
    request = supertest(app.getHttpServer())
  })

  afterAll(async () => {
    await app.close()
  })

  return () => request
}

export const dealCreatedListener = async () => {
    const mod = await Test.createTestingModule({
      controllers: [DealListener],
    }).compile()

    return mod.get<DealListener>(DealListener)
}

export const createApiKey = async () => await ApiKeyModel.create({
  data: {
    id: faker.string.uuid(),
    key: faker.string.alphanumeric(36),
    seller: {
      create: {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
      },
    },
  },
})

export const createSeller = async () => await SellerModel.create({
  data: {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
  }
})

export const createDeal  = async (deal?: Partial<CreatedPayload>) => {
  let sellerId = deal?.sellerId
  if (!sellerId) {
    sellerId = (await createSeller()).id
  }
  const data = dealData({ ...deal, sellerId })
  return dealModel.createWithItems(data)
}

export const dealData = (data: Partial<CreatedPayload>): CreatedPayload => ({
  id: data?.id ?? faker.string.uuid(),
  sellerId: data?.sellerId ?? faker.string.uuid(),
  createdAt: data?.createdAt ?? faker.date.recent(),
  updatedAt: data?.updatedAt ?? faker.date.recent(),
  name: faker.string.alpha(5),
  totalPrice: 1000,
  currency: 'GBP',
  status: 'sold',
  items: [
    {
      id: faker.string.uuid(),
      name: faker.string.alpha(5),
      price: 2200,
    },
    {
      id: faker.string.uuid(),
      name: faker.string.alpha(5),
      price: 4444000,
    },
  ],
})
