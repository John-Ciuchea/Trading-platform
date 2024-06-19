import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Seller } from '@prisma/client'

export const AuthUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Seller =>
    ctx.switchToHttp().getRequest().user,
)
