import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePersonDto } from './person.dto';
import generateUniqueId from 'src/utils';

@Injectable()
export class PersonService {
  private persons: CreatePersonDto[] = []; // This is a temporary storage. Replace with a real database.

  create(createPersonDto: CreatePersonDto): any {
    const { name, email } = createPersonDto;
    const existingPerson = this.checkIfPersonExists(email);
    if (existingPerson) {
      throw new ConflictException('Email already exists');
    }
    // can perform other validations like if the email is valid or not

    const id = generateUniqueId(); // Implement a function to generate unique IDs

    const person = { id, name, email };
    this.persons.push(person);
    return person;
  }

  checkIfPersonExists(email: string): boolean {
    const existingPerson = this.persons.find(
      (person) => person.email === email,
    );
    return !!existingPerson;
  }
}
