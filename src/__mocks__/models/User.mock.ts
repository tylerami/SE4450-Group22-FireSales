import { User } from "models/User";

export const sampleUser: User = User.create({
  uid: "user123",
  email: "tamirau@uwo.ca",
  firstName: "Tyler",
  lastName: "Amirault",
  compensationGroupId: "group123",
});
