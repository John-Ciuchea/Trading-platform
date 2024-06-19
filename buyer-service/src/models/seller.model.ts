import { PrismaClient } from '@prisma/client'
import db from '../common/prisma.client'

const model = (deal: PrismaClient['seller']) => Object.assign(deal, {
  
})

export default model(db.seller)
