import { Module } from '@nestjs/common';
import { DateService } from './date.service';
import { DateController } from './date.controller';

@Module({
  providers: [DateService],
  controllers: [DateController]
})
export class DateModule {}
