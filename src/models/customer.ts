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

function generateUserID(length: number = 24): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
