import { Injectable } from '@nestjs/common'
import {
  NatsJetStreamClientProxy,
} from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { PublishEvent } from '../events/deal.event'

@Injectable()
export class EventService {
  constructor(
    private client: NatsJetStreamClientProxy,
  ) {}

  emit<T>(event: PublishEvent<T>) {
    return this.client.emit(event.getSubject(), event.getPayload()).subscribe()
  }
}
