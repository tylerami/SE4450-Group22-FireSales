export class Message {
  senderUid: string;
  receiverUid: string;
  message: string;
  timestamp: Date;

  constructor({
    senderUid,
    receiverUid,
    message,
    timestamp,
  }: {
    senderUid: string;
    receiverUid: string;
    message: string;
    timestamp: Date;
  }) {
    this.senderUid = senderUid;
    this.receiverUid = receiverUid;
    this.message = message;
    this.timestamp = timestamp;
  }
}
