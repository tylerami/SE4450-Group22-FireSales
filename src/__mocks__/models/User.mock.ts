import { Role } from "models/enums/Role";
import { generateUserID } from "models/utils/Identification";
import { User } from "models/User";

export const sampleUser: User = User.create({
  uid: "user123",
  email: "tamirau@uwo.ca",
  firstName: "Tyler",
  lastName: "Amirault",
  compensationGroupId: "diamond-A",
});

export function generateSampleUsers(count: number): User[] {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    const uid = generateUserID(); // Generate a random UID
    const firstName = `FirstName${i}`;
    const lastName = `LastName${i}`;
    const email = `johnHenry@gmail.com`;
    const roles = [Role.salesperson]; // Default role
    const registeredAt = new Date();
    const profilePictureSrc = undefined;
    const phone = Math.random() > 0.5 ? `123-456-789${i}` : undefined;
    const compensationGroupId = `diamond-A`;

    users.push(
      new User({
        uid,
        profilePictureSrc,
        firstName,
        lastName,
        email,
        phone,
        roles,
        registeredAt,
        compensationGroupId,
      })
    );
  }

  return users;
}
