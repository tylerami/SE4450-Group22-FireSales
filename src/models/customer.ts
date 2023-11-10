import { generateUserID } from "utils/Identification";

// Deprecate function
export function customerIdFromName(fullName: string) {
  return fullName.replaceAll(" ", "_").toLowerCase();
}

export class Customer {
  id: string;
  fullName: string;
  email?: string;

  constructor({
    fullName,
    id = generateUserID(),
    email,
  }: {
    id: string;
    fullName: string;
    email?: string;
  }) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
  }
}
