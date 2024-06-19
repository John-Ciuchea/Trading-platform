import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mock, mockReset } from 'vitest-mock-extended'
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { JsMsg } from 'nats'
import { createSeller, dealCreatedListener, dealData } from '../helper'

describe('Deal listener', () => {
  let jsMsg: JsMsg
  let ctx: NatsJetStreamContext
  beforeEach(() => {
    jsMsg = mock<JsMsg>()
    ctx = new NatsJetStreamContext([jsMsg])
  })
  afterEach(() => {
    mockReset(jsMsg)
  })

  it('Should validate the payload', async () => {
    const listener = await dealCreatedListener()
    await listener.persistDeal({}, ctx)

    expect(ctx.message.term).toHaveBeenCalledOnce()
  })
  it('Should create/update db record and reply with ack', async () => {
    const listener = await dealCreatedListener()
    const seller = await createSeller()
    const payload = dealData({
      sellerId: seller.id
    })
    await listener.persistDeal(payload, ctx)

    expect(ctx.message.ack).toHaveBeenCalledOnce()
  })
})
