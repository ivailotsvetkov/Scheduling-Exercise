export class CreatePersonDto {
  readonly name: string;
  readonly email: string;
}

export class GetSuggestedTimeslotsDto {
  readonly date: Date;
  readonly emails: string[];
}
