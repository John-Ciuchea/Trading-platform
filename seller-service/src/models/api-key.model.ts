import { PrismaClient, Seller } from '@prisma/client'
import db from '../common/prisma.client'

const model = (apiKey: PrismaClient['apiKey']) =>
  Object.assign(apiKey, {
    findSellerByKey: async (key?: string): Promise<Seller | null> => {
      if (!key) {
        return null
      }
      const apikeyModel = await apiKey.findUnique({
        where: { key },
        include: { seller: true },
      })
      return apikeyModel?.seller ?? null
    },
  })

export default model(db.apiKey)
