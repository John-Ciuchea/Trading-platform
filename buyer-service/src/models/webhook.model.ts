import { PrismaClient } from '@prisma/client'
import db from '../common/prisma.client'

const model = (webhook: PrismaClient['webhook']) => Object.assign(webhook, {

})

export default model(db.webhook)
