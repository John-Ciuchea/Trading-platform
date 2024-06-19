import { Module } from '@nestjs/common';
import { DealController } from '../controllers/deal.controller';

@Module({
  imports: [],
  controllers: [DealController],
  providers: [],
})
export class HttpModule {
}
