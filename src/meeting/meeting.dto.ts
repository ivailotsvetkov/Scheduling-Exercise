// meeting.dto.ts
export class CreateMeetingDto {
  readonly title: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly participantEmails: string[]; // Array of person IDs
}
