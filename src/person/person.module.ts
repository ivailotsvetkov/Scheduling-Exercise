import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { MeetingModule } from 'src/meeting/meetings.module';

@Module({
  controllers: [PersonController],
  providers: [PersonService],
  imports: [MeetingModule],
})
export class PersonModule {}
