import { z } from 'zod'
import { Currency, Status } from '@prisma/client'

export const createdSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  totalPrice: z.number(),
  currency: z.nativeEnum(Currency),
  status: z.nativeEnum(Status),
  sellerId: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreatedPayload = z.infer<typeof createdSchema>
