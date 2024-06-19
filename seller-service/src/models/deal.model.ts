import { PrismaClient } from '@prisma/client'
import db from '../common/prisma.client'
import { CreatedPayload } from '../types/deal.types'

const model = (deal: PrismaClient['deal']) => Object.assign(deal, {
  createWithItems({ id, items, ...dealData }: CreatedPayload) {
    return deal.upsert({
      where: { id: id },
      update: {
        ...dealData,
        items: {
          deleteMany: {},
          create: items,
        }
      },
      create: {
        ...dealData,
        id,
        items: {
          create: items,
        }
      }
    })
  }
})

export default model(db.deal)
