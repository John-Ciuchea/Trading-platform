import { PrismaClient } from '@prisma/client'
import db from '../common/prisma.client'

const model = (seller: PrismaClient['seller']) => Object.assign(seller, {})

export default model(db.seller)
