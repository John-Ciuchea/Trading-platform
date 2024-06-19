import { JsMsg } from 'nats'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mock, mockReset } from 'vitest-mock-extended'
import { NatsJetStreamClientProxy, NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { createDealAndSeller, dealCreatedListener, dealData } from './helper'
import buyerModel from '../src/models/buyer.model'
import sellerModel from '../src/models/seller.model'
import { faker } from '@faker-js/faker'

describe('Persist deal', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  let jsMsg: JsMsg
  let ctx: NatsJetStreamContext

  beforeEach(() => {
    jsMsg = mock<JsMsg>()
    ctx = new NatsJetStreamContext([jsMsg])
  })
  afterEach(() => {
    mockReset(jsMsg)
  })

  it('should nak when seller is missing', async () => {
    const listener = await dealCreatedListener()
    const payload = dealData()
    jsMsg.info.deliverySequence = payload.deliverySequence
    await listener.handleDealCreated(payload, ctx)

    expect(ctx.message.term).toHaveBeenCalledOnce()
  })

  it('should nak if deal already exists', async () => {
    const listener = await dealCreatedListener()
    const payload = await createDealAndSeller()
    await listener.handleDealCreated(payload, ctx)

    expect(ctx.message.term).toHaveBeenCalledOnce()
  })

  it('should save and fire the webhooks', async () => {
    const spyEmit = vi.spyOn(NatsJetStreamClientProxy.prototype, 'emit');
    const [seller1, seller2, seller3] = await Promise.all([
      sellerModel.create({ data: { id: faker.string.uuid() } }),
      sellerModel.create({ data: { id: faker.string.uuid() } }),
      sellerModel.create({ data: { id: faker.string.uuid() } }),
    ])

    const buyer1 = buyerModel.create({
      data: {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        sellers: {
          connect: [seller1, seller2 ]
        },
        webhooks: {
          create: [
            {
              id: faker.string.uuid(),
              name: 'should be in results',
              event: 'deal.created',
              url: faker.internet.url()
            },
            {
              id: faker.string.uuid(),
              name: 'should NOT be in results',
              event: 'deal.updated',
              url: faker.internet.url()
            }
          ]
        }
      }
    })
    const buyer2 = buyerModel.create({
      data: {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        sellers: {
          connect: [seller1, seller3],
        },
        webhooks: {
          create: [
            {
              id: faker.string.uuid(),
              name: 'should be in results',
              event: 'deal.*',
              url: faker.internet.url()
            }
          ]
        }
      }
    })
    const buyer3 = buyerModel.create({
      data: {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        sellers: {
          connect: [seller2, seller1],
        },
        webhooks: {
          create: [
            {
              id: faker.string.uuid(),
              name: 'should NOT be in results',
              event: 'deal.updated',
              url: faker.internet.url()
            }
          ]
        }
      }
    })
    const buyer4 = buyerModel.create({
      data: {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        sellers: {
          connect: [seller2, seller3],
        },
        webhooks: {
          create: [
            {
              id: faker.string.uuid(),
              name: 'should NOT be in results',
              event: 'deal.created',
              url: faker.internet.url()
            }
          ]
        }
      }
    })
    await Promise.all([buyer1, buyer2, buyer3, buyer4])

    const listener = await dealCreatedListener()

    const payload = dealData({ sellerId: seller1.id })
    jsMsg.info.deliverySequence = payload.deliverySequence

    await listener.handleDealCreated(payload, ctx)

    expect(ctx.message.ack).toHaveBeenCalledOnce()
    expect(spyEmit).toHaveBeenCalled()
  })
})
