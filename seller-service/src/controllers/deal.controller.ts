import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common'
import { Seller } from '@prisma/client'
import { AuthUser } from '../decorators/auth.user.decorator'
import { ValidationPipe } from '../common/zod'
import { CreateBody, CreatedPayload, createSchema, UpdateBody, updateSchema } from '../types/deal.types'
import { EventService } from '../services/event.service'
import { AuthGuard } from '../guards/auth.guard'
import { DealCreated, DealUpdated } from '../events/deal.event'

@UseGuards(AuthGuard)
@Controller('deal')
export class DealController {
  constructor(private eventService: EventService) {}

  @Post()
  create(
    @AuthUser() seller: Seller,
    @Body(new ValidationPipe(createSchema)) body: CreateBody,
  ): CreatedPayload {
    const event = DealCreated.create(seller, body)
    this.eventService.emit(event)

    return event.getPayload()
  }

  @Put()
  update(@Body(new ValidationPipe(updateSchema)) body: UpdateBody) {
    const event = DealUpdated.create(body)
    this.eventService.emit(event)

    return event.getPayload()
  }

}
