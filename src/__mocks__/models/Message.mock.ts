import { Message } from "src/models/Message";

const messageSample1 = new Message({
  senderUid: "user123",
  receiverUid: "user456",
  body: "Hello, how are you?",
  timestamp: new Date(),
});

const messageSample2 = new Message({
  senderUid: "user456",
  receiverUid: "user123",
  body: "I am fine, thank you!",
  timestamp: new Date(),
});

export const sampleMessages = [messageSample1, messageSample2];
