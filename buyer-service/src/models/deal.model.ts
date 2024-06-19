import { Deal, PrismaClient } from '@prisma/client'
import db from '../common/prisma.client'

const model = (deal: PrismaClient['deal']) => Object.assign(deal, {

  createFromEvent: async (data: Deal) => {
    try {
      return await deal.create({ data })
    } catch (e) {
      console.error(e)
      return null;
    }
  },
  updateFromEvent: async (data: Deal): Promise<Deal|null> => {
    try {
      return await deal.update({ where: { id: data.id }, data })
    } catch (e) {
      console.error(e)
      return null;
    }
  },
  find: async (id: string): Promise<Deal | null> => {
    return deal.findUnique({ where: { id } })
  },
  getForBuyer: async (buyerId: string, take: number, cursor: number) => {
    return deal.findMany({
      take: take,
      cursor: { deliverySequence: cursor },
      where: {
        seller: {
          buyers: {
            some: { id: buyerId }
          }
        }
      },
      orderBy: { deliverySequence: 'asc' }
    })
  }
})

export default model(db.deal)
