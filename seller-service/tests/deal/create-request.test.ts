import { describe, expect, it, vi } from 'vitest'
import { HttpStatus } from '@nestjs/common'
import { createApiKey, useApp } from '../helper'
import { faker } from '@faker-js/faker'
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport'

describe('Create deal request', () => {
  const request = useApp()

  it('should check api key header', async () => {
    const res = await request().post('/deal')

    expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
    expect(res.body.message).toBe('Unauthorized')
  })

  it('should check api key existence', async () => {
    const res = await request()
      .post('/deal')
      .set('x-api-key', 'some-random-secret-key')

    expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
    expect(res.body.message).toBe('Unauthorized')
  })

  it.each([
    {
      description: 'empty body',
      data: 'empty body',
      fields: [
        [['name'], 'Required'],
        [['totalPrice'], 'Required'],
        [['currency'], 'Required'],
        [['status'], 'Required'],
        [['items'], 'Required'],
      ],
    },
    {
      description: 'invalid values',
      data: {
        name: 123,
        totalPrice: 'asd',
        currency: 'OOOO',
        discount: {
          type: 'asf',
          amount: 'asd',
        },
        status: 1234,
        items: [],
      },
      fields: [
        [['name'], 'Expected string, received number'],
        [['totalPrice'], 'Expected number, received string'],
        [['currency'], "Invalid enum value. Expected 'GBP' | 'USD' | 'EUR', received 'OOOO'"],
        [['discount', 'type'], "Invalid enum value. Expected 'flat' | 'percentage', received 'asf'"],
        [['discount', 'amount'], 'Expected number, received string'],
        [['status'], "Invalid enum value. Expected 'available' | 'sold', received '1234'"],
        [['items'], 'Array must contain at least 1 element(s)'],
      ],
    },
  ])('should validate $description', async ({ data, fields }) => {
    const apiKey = await createApiKey()
    const res = await request()
      .post('/deal')
      .set('x-api-key', apiKey.key)
      .send(data)

    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
    expect(res.body.length).toEqual(fields.length)
    fields.forEach(([path, message]) => {
      expect(res.body).toEqual(expect.arrayContaining([
        expect.objectContaining({ path, message })
      ]))
    })
  })

  it('should emit an event', async () => {
    const spyEmit = vi.spyOn(NatsJetStreamClientProxy.prototype, 'emit')

    const apiKey = await createApiKey()
    const data = {
      name: faker.string.alpha(5),
      totalPrice: 1000,
      currency: 'GBP',
      status: 'sold',
      items: [
        { name: faker.string.alpha(5), price: 2200 },
        { name: faker.string.alpha(5), price: 220000 },
      ],
    }
    const res = await request()
      .post('/deal')
      .set('x-api-key', apiKey.key)
      .send(data)


    // TODO: assert event payload and response contains request data
    expect(spyEmit).toHaveBeenCalledOnce()
    expect(res.status).toBe(HttpStatus.CREATED)
  })
})
