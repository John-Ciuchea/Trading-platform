import { DealSubject } from '../events/deal.event'

export const natsConnectionOptions = {
  servers: process.env.APP_NATS_HOST || 'localhost:4222',
  name: 'seller-listener',
}

export const natsServerConfig = {
  connectionOptions: natsConnectionOptions,
  consumerOptions: {
    deliverGroup: 'seller-group',
    durable: 'seller-durable',
    deliverTo: 'seller-messages',
    manualAck: false,
  },
  streamConfig: [{
    name: 'DEALS',
    subjects: [DealSubject.ALL],
  }],
}
