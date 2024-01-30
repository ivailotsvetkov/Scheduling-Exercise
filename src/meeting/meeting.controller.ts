// meeting.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateMeetingDto } from './meeting.dto';
import { MeetingService } from './meeting.service';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  // would have been a been to create meetings from the person controller, by passing an array of emails, that way we can check if the emails exist
  @Post()
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingService.create(createMeetingDto);
  }
}
