import { Module } from '@nestjs/common'
import { DealListener } from '../listeners/deal.listener'

@Module({
  imports: [],
  controllers: [DealListener],
  providers: [],
})
export class NatsModule {}
