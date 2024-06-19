import { Deal } from '@prisma/client'
import { diff } from 'deep-object-diff'

const findKeyDiffs = (
  { updatedAt: ud, createdAt: cd, ...oldDeal }: Deal,
  { updatedAt: up, createdAt: cp, ...newDeal }: Deal,
) => Object.keys(diff(oldDeal, newDeal))

export const getFieldEventTypes = (oldDeal: Deal, newDeal: Deal) => {
  let fieldEventTypes = findKeyDiffs(oldDeal, newDeal).map(key => `deal.updated.${key}`)
  if (fieldEventTypes.length > 0) {
    fieldEventTypes = ['deal.updated.*', ...fieldEventTypes]
  }
  return fieldEventTypes
}
