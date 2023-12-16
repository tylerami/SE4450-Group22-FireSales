import { User } from "models/User";

interface EmailService {
  sendEmail({
    body,
    subject,
    recipients,
  }: {
    body: string;
    subject: string;
    recipients: User[];
  }): Promise<void>;
}

export default EmailService;
