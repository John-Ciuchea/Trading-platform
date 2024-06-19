import { CreateBody, CreatedPayload, UpdateBody } from '../types/deal.types'
import { Seller } from '@prisma/client'
import { v4 as uuid } from 'uuid'

export enum DealSubject {
  CREATED = 'deal.created',
  UPDATED = 'deal.updated',
  ALL = 'deal.*',
}

export interface PublishEvent<T> {
  getSubject(): DealSubject

  getPayload(): T
}

export class DealCreated implements PublishEvent<CreatedPayload> {
  constructor(
    private readonly payload: CreatedPayload,
  ) {}

  getSubject() {
    return DealSubject.CREATED
  }

  getPayload() {
    return this.payload
  }

  static create(seller: Seller, { items, ...data }: CreateBody): DealCreated {
    const now = new Date()
    return new DealCreated({
      ...data,
      id: uuid(),
      sellerId: seller.id,
      createdAt: now,
      updatedAt: now,
      // @ts-expect-error Type
      items: items.map((i) => ({ id: uuid(), ...i })),
    })
  }
}

export class DealUpdated implements PublishEvent<CreatedPayload> {
  constructor(
    private readonly payload: CreatedPayload,
  ) {
  }

  getSubject() {
    return DealSubject.UPDATED
  }

  getPayload() {
    return this.payload
  }

  static create({ items, ...data }: UpdateBody) {
    const now = new Date()

    return new DealUpdated({
      ...data,
      updatedAt: now,
      // @ts-expect-error Type
      items: items.map(({ id, ...i }) => ({ id: id ?? uuid(), ...i })),
    })
  }
}
