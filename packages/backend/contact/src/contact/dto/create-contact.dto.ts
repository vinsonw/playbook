export class CreateContactDto {
  name: string;
  age: number;
  index: string;
  uploadStrategy?: 'slice-and-merge' | 'whole';
}
