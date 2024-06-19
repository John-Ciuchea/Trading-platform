import { PrismaClient } from '@prisma/client'
import db from '../common/prisma.client'
import webhookModel from './webhook.model'

const model = (buyer: PrismaClient['buyer']) => Object.assign(buyer, {
  async findDealWebhooks(sellerId: string, events: string[]) {
    const buyers = await buyer.findMany({
      where: {
        sellers: {
          some: { id: sellerId },
        }
      },
    })
    return webhookModel.findMany({ where: {
      AND: [
        { buyerId: { in: buyers.map(b => b.id) }},
        { event: { in: events },}
      ],
    }})
  },
})

export default model(db.buyer)
