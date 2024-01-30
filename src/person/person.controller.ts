import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto, GetSuggestedTimeslotsDto } from './person.dto';
import { PersonService } from './person.service';
import { MeetingService } from 'src/meeting/meeting.service';

@Controller('persons')
export class PersonController {
  constructor(
    private readonly personService: PersonService,
    private readonly meetingsService: MeetingService,
  ) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get(':email/meetings')
  getAllMeetingsForUserEmail(@Param('email') email: string) {
    if (this.personService.checkIfPersonExists(email)) {
      const meetingsOfTheUser = this.meetingsService.meetings.filter(
        (meeting) => meeting.participantEmails.includes(email),
      );
      return meetingsOfTheUser;
    }
    return new NotFoundException('Email not found');
  }

  @Get(':email/upcoming-meetings')
  getUpcomingMeetingForEmailAndDate(
    @Param('email') email: string,
    @Query('date') date: string,
  ) {
    if (this.personService.checkIfPersonExists(email)) {
      const meetingsOfTheUser = this.meetingsService.meetings.filter(
        (meeting) =>
          meeting.participantEmails.includes(email) &&
          meeting.startDate.getTime() > date
            ? new Date(date)
            : Date.now(),
      );
      return meetingsOfTheUser;
    }
    throw new NotFoundException('Email not found');
  }

  // takes in an array of emails and a date for which we want to get the suggested timeslots
  // should return an array of suggested timeslots for the given emails ex. [10,15,16]
  @Get()
  getSuggestedFreeTimeSlotsForUserEmails(
    @Body() getTimeslot: GetSuggestedTimeslotsDto,
  ) {
    // let's say a working day is from 8:00 till 17:00
    const workingHoursSet = new Set(
      Array.from({ length: 10 }, (_, index) => index + 8),
    );
    console.log(workingHoursSet); // {8, 9, 10, 11, 12, 13, 14, 15, 16, 17}

    // looping through every person's upcoming meeting and removing the hours from the total working hours set
    for (const email of getTimeslot.emails) {
      if (!this.personService.checkIfPersonExists(email)) {
        return new NotFoundException('Email not found');
      }
      const takenSlots = this.getUpcomingMeetingForEmailAndDate(
        email,
        getTimeslot.date?.toString(),
      );
      takenSlots.forEach((element) => {
        if (workingHoursSet.has(element.startDate.getHours())) {
          workingHoursSet.delete(element.startDate.getHours());
        }
      });
    }

    // if there is a dae passed return only the hours that are after the date
    const workingHoursArray = getTimeslot.date
      ? Array.from(workingHoursSet).filter(
          (hour) => hour >= getTimeslot.date.getHours(),
        )
      : Array.from(workingHoursSet);
    return workingHoursArray;
  }
}
