import { User } from "models/User";
import EmailService from "services/interfaces/EmailService";
import FeatureFlagService from "services/interfaces/FeatureFlagService";
import axios from "axios";
import { formatDateStringWithTime } from "models/utils/Date";

class EmailTwilioService implements EmailService {
  private sendgridTemplateId?: string;
  private functionUrl?: string;
  private flagService: FeatureFlagService;

  constructor(flagService: FeatureFlagService) {
    this.flagService = flagService;
    this.initializeSendGrid();
  }

  async initializeSendGrid(): Promise<void> {
    if (this.sendgridTemplateId && this.functionUrl) return;

    const functionUrl: string | null =
      this.functionUrl ??
      (await this.flagService.getFlagValue<string>("sendgrid_service_url"));

    const templateId: string | null =
      this.sendgridTemplateId ??
      (await this.flagService.getFlagValue<string>("sendgrid_template_id"));

    if (!functionUrl) {
      throw new Error("No sendgrid service url found");
    }
    if (!templateId) {
      throw new Error("No sendgrid template id found");
    }

    this.sendgridTemplateId = templateId;
    this.functionUrl = functionUrl;
  }

  async sendEmail({
    body,
    subject,
    recipients,
  }: {
    body: string;
    subject: string;
    recipients: User[];
  }): Promise<void> {
    await this.initializeSendGrid();

    if (!this.sendgridTemplateId || !this.functionUrl) {
      throw new Error("No sendgrid api key or template id found");
    }

    // Convert recipients to the format required by SendGrid
    const to = recipients.map((user) => ({
      email: user.email,
      name: user.getFullName(),
    }));

    const emailData = {
      personalizations: [
        {
          to,
          subject,
          dynamic_template_data: {
            body,
            header: subject,
            date: formatDateStringWithTime(new Date()),
          },
        },
      ],
      subject,
      from: {
        email: "affiliates@hottakesapp.com",
        name: "HotTakes Affiliates",
      },

      template_id: this.sendgridTemplateId,
    };

    console.log(emailData);

    try {
      console.log("Sending email with data to url ", this.functionUrl);
      await axios.post(this.functionUrl, emailData);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to send email");
    }
  }
}

export default EmailTwilioService;
