import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { describe, expect, it, vi } from 'vitest'
import { HttpStatus } from '@nestjs/common'
import { createApiKey, createDeal, dealData, useApp } from '../helper'

describe('Update deal request', () => {
  const request = useApp()

  it('should update a deal', async () => {
    const spyEmit = vi.spyOn(NatsJetStreamClientProxy.prototype, 'emit')
    const apiKey = await createApiKey()
    const deal = await createDeal({ sellerId: apiKey.sellerId })
    const data = dealData({ id: deal.id })

    const res = await request()
      .put('/deal')
      .set('x-api-key', apiKey.key)
      .send(data)

    // TODO: assert event payload and response contains request data
    expect(spyEmit).toHaveBeenCalledOnce()
    expect(res.status).toBe(HttpStatus.OK)
  })
})
