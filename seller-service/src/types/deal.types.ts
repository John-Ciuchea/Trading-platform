import { z } from 'zod'
import { Currency, Status } from '@prisma/client'

export enum DiscountType {
  FLAT = 'flat',
  PERCENTAGE = 'percentage',
}
const itemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
})

export const createdSchema = z.object({
  id: z.string().uuid(),
  sellerId: z.string().uuid(),
  name: z.string(),
  totalPrice: z.number(),
  currency: z.nativeEnum(Currency),
  discount: z.object({
    type: z.nativeEnum(DiscountType),
    amount: z.number(),
  }).optional(),
  status: z.nativeEnum(Status),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  items: z.array(itemSchema).nonempty()
})

export const createSchema = createdSchema.omit({
  id: true,
  sellerId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  items: z.array(itemSchema.omit({ id: true })).nonempty()
})

export const updateSchema = createdSchema.extend({
  items: z.array(itemSchema.partial({ id: true })).nonempty()
})

export type CreateBody = z.infer<typeof createSchema>
export type UpdateBody = z.infer<typeof updateSchema>
export type CreatedPayload = z.infer<typeof createdSchema>
