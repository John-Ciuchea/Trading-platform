import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import dealModel from '../models/deal.model'

@Controller('deal')
export class DealController {

  @Get()
  async findAll(
    @Req() req: Request,
  ) {
    // TODO: use proper authentication
    const buyerId = req.header('x-api-key')
    if (!buyerId) {
      throw new UnauthorizedException()
    }
    const take = Number(req.query.take) || 2;
    const cursor = Number(req.query.cursor?.toString()) || 0;
    const deals = await dealModel.getForBuyer(buyerId, take + 1, cursor)

    return { deals, cursor: deals.pop()?.deliverySequence }
  }
}
