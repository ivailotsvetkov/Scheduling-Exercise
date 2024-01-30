import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CreatePersonDto, GetSuggestedTimeslotsDto } from './person.dto';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { MeetingService } from '../meeting/meeting.service';

describe('PersonController', () => {
  let personController: PersonController;
  let personService: PersonService;
  let meetingService: MeetingService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [PersonService, MeetingService],
    }).compile();

    personController = app.get<PersonController>(PersonController);
    personService = app.get<PersonService>(PersonService);
    meetingService = app.get<MeetingService>(MeetingService);
  });

  describe('create', () => {
    it('should create a person', () => {
      const createPersonDto: CreatePersonDto = {
        email: 'test',
        name: 'test',
      };

      jest.spyOn(personService, 'create').mockReturnValueOnce(createPersonDto);

      const result = personController.create(createPersonDto);

      expect(personService.create).toHaveBeenCalledWith(createPersonDto);
      expect(result).toEqual(createPersonDto);
    });
  });

  describe('getAllMeetingsForUserEmail', () => {
    it('should return all meetings for a user email', () => {
      const email = 'test@example.com';
      const meetings = [
        {
          id: 1,
          participantEmails: ['test@example.com'],
          startDate: new Date('2022-01-01T10:00:00Z'),
        },
        {
          id: 2,
          participantEmails: ['test@example.com'],
          startDate: new Date('2022-01-01T14:00:00Z'),
        },
      ];

      jest
        .spyOn(personService, 'checkIfPersonExists')
        .mockReturnValueOnce(true);
      jest.spyOn(meetingService, 'meetingsList').mockReturnValueOnce(meetings);

      const result = personController.getAllMeetingsForUserEmail(email);

      expect(personService.checkIfPersonExists).toHaveBeenCalledWith(email);
      expect(result).toEqual(meetings);
    });

    it('should throw NotFoundException if email does not exist', () => {
      const email = 'test@example.com';

      jest
        .spyOn(personService, 'checkIfPersonExists')
        .mockReturnValueOnce(false);

      expect(() => {
        personController.getAllMeetingsForUserEmail(email);
      }).toThrow(NotFoundException);
    });
  });

  describe('getUpcomingMeetingForEmailAndDate', () => {
    it('should return upcoming meetings for a user email and date', () => {
      const email = 'test1@example.com';
      const date = '2022-01-01T00:00:00Z';
      const meetings = [
        {
          id: 1,
          participantEmails: ['test@example.com'],
          startDate: new Date('2022-01-01T10:00:00Z'),
        },
        {
          id: 2,
          participantEmails: ['test@example.com'],
          startDate: new Date('2022-01-01T14:00:00Z'),
        },
      ];

      jest
        .spyOn(personService, 'checkIfPersonExists')
        .mockReturnValueOnce(true);
      jest
        .spyOn(personController, 'getUpcomingMeetingForEmailAndDate')
        .mockReturnValueOnce(meetings);

      const result = personController.getUpcomingMeetingForEmailAndDate(
        email,
        date,
      );

      expect(result).toEqual(meetings);
    });

    it('should throw NotFoundException if email does not exist', () => {
      const email = 'test@example.com';
      const date = '2022-01-01T00:00:00Z';

      jest
        .spyOn(personService, 'checkIfPersonExists')
        .mockReturnValueOnce(false);

      expect(() => {
        personController.getUpcomingMeetingForEmailAndDate(email, date);
      }).toThrow(NotFoundException);
    });
  });

  describe('getSuggestedFreeTimeSlotsForUserEmails', () => {
    it('should return suggested free time slots for user emails', () => {
      const getTimeslot: GetSuggestedTimeslotsDto = {
        emails: ['test1@example.com', 'test2@example.com'],
        date: new Date('2022-01-01T00:00:00Z'),
      };

      const createPersonDto1: CreatePersonDto = {
        email: 'test1@example.com',
        name: 'test1@example.com',
      };
      const createPersonDto2: CreatePersonDto = {
        email: 'test2@example.com',
        name: 'test2@example.com',
      };

      personController.create(createPersonDto1);
      personController.create(createPersonDto2);
      const takenSlots = [
        {
          id: 1,
          participantEmails: ['test1@example.com'],
          startDate: new Date('2022-01-01T10:00:00Z'),
        },
        {
          id: 2,
          participantEmails: ['test2@example.com'],
          startDate: new Date('2022-01-01T14:00:00Z'),
        },
      ];

      jest
        .spyOn(personService, 'checkIfPersonExists')
        .mockReturnValueOnce(true);
      jest
        .spyOn(personController, 'getUpcomingMeetingForEmailAndDate')
        .mockReturnValueOnce(takenSlots);

      const result =
        personController.getSuggestedFreeTimeSlotsForUserEmails(getTimeslot);

      expect(
        personController.getUpcomingMeetingForEmailAndDate,
      ).toHaveBeenCalledTimes(2);
      expect(result).toEqual([8, 9, 11, 12, 13, 15, 16, 17]);
    });

    it('should throw NotFoundException if email does not exist', () => {
      const getTimeslot: GetSuggestedTimeslotsDto = {
        emails: ['test@example.com'],
        date: new Date('2022-01-01T00:00:00Z'),
      };

      jest
        .spyOn(personService, 'checkIfPersonExists')
        .mockReturnValueOnce(false);

      expect(() => {
        personController.getSuggestedFreeTimeSlotsForUserEmails(getTimeslot);
      }).toThrow(NotFoundException);
    });
  });
});
