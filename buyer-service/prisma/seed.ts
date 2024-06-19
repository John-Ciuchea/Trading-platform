import sellerModel from '../src/models/seller.model'
import { faker } from '@faker-js/faker'
import { Currency, Status } from '@prisma/client'
import buyerModel from '../src/models/buyer.model'

const seed = async () => {
  const seller1 = '90d57fe0-0fa1-4dae-a51c-917cc82bcdda'
  const seller = await sellerModel.upsert({
    where: { id: seller1 },
    update: {},
    create: {
      id: seller1,
      deals: {
        create: [...Array(10).keys()].map((i) => ({
          id: faker.string.uuid(),
          name: faker.string.alpha(5),
          totalPrice: faker.number.int(999999),
          currency: Currency.GBP,
          status: Status.available,
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
          deliverySequence: (i + 99999999),
        })),
      },
    },
  })
  const buyer1 = '90d57fe0-0fa1-4dae-a51c-917cc82bcddc';
  await buyerModel.upsert({
    where: { id: buyer1 },
    update: {},
    create: {
      id: buyer1,
      name: 'buyer1 name',
      sellers: { connect: [seller] },
      webhooks: {
        create: [{
          id: faker.string.uuid(),
          name: 'All deal events',
          event: 'deal.*',
          url: faker.internet.url(),
        },{
          id: faker.string.uuid(),
          name: 'Deal updated events',
          event: 'deal.updated',
          url: faker.internet.url(),
        },{
          id: faker.string.uuid(),
          name: 'Deal created events',
          event: 'deal.created',
          url: faker.internet.url(),
        }, {
          id: faker.string.uuid(),
          name: 'All deal field updated events',
          event: 'deal.updated.*',
          url: faker.internet.url(),
        }]
      }
    },
  })
}
seed().then(() => console.log('Done seeding.'))
