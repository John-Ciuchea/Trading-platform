
export const natsConnectionOptions = {
  servers: process.env.APP_NATS_HOST || 'localhost:4222',
  name: 'buyer-listener',
}

export const natsServerConfig = {
  connectionOptions: natsConnectionOptions,
  consumerOptions: {
    deliverGroup: 'buyer-group',
    durable: 'buyer-durable',
    deliverTo: 'buyer-messages',
    manualAck: false,
  },
  streamConfig: [{
    name: 'DEALS',
    subjects: ['deal.*'],
  }, {
    name: 'WEBHOOK',
    subjects: ['webhook.*'],
  }],
}
