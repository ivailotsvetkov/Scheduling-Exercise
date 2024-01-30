import { BadRequestException, Injectable } from '@nestjs/common';
import generateUniqueId from 'src/utils';
import { CreateMeetingDto } from './meeting.dto';

@Injectable()
export class MeetingService {
  meetings: any[] = []; // Temporary storage. Replace with proper database integration.

  async create(createMeetingDto: CreateMeetingDto): Promise<any> {
    const { title, startDate, endDate, participantEmails } = createMeetingDto;

    // Check if the meeting duration is exactly one hour
    const durationInMilliseconds = endDate.getTime() - startDate.getTime();
    const oneHourInMilliseconds = 60 * 60 * 1000;

    if (durationInMilliseconds !== oneHourInMilliseconds) {
      throw new BadRequestException('Meeting must last exactly one hour.');
    }
    if (
      this.meetings.find(
        (meeting) =>
          meeting.startDate.getTime() === startDate.getTime() &&
          meeting.endDate.getTime() === endDate.getTime() &&
          meeting.participantEmails.some((email) =>
            participantEmails.includes(email),
          ),
      )
    ) {
      throw new BadRequestException(
        'Meeting with the same participants already exists.',
      );
    }
    // would have been a been to create meetings from the person controller, by passing an array of emails, that way we can check if the emails exist
    const id = generateUniqueId(); // Implement a function to generate unique IDs

    const meeting = { id, title, startDate, endDate, participantEmails };
    this.meetings.push(meeting);
    return meeting;
  }
}
