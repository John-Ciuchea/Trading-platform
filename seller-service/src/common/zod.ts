import { PipeTransform, HttpException, HttpStatus } from '@nestjs/common'
import { ZodSchema } from 'zod'

export class ValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value)
    if (result.success) {
      return result.data
    }
    throw new HttpException(
      result.error.issues,
      HttpStatus.UNPROCESSABLE_ENTITY,
    )
  }
}
