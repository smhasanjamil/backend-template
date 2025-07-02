import nodemailer from "nodemailer";
import { generateOTP } from "./generateOTP";
import config from "../config";

type EmailOptions = {
  email: string;
  subject: string;
  html: string;
};

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.mail,
        pass: config.mail_password,
      },
    });
  }

  async sendEmail(options: EmailOptions) {
    try {
      await this.transporter.sendMail({
        from: `"${config.app_name}" <${config.mail}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
      });
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendVerificationEmail(email: string, otp: string) {
    const subject = `Verify Your Email for ${config.app_name}`;
    const verificationLink = `${config.base_url_server}/api/auth/verify-email?otp=${otp}&email=${email}`;
    const html = `
      <div>
        <h2>Welcome to ${config.app_name}!</h2>
        <p>Please verify your email using this OTP:</p>
        <h3>${otp}</h3>
        <p>Or click: <a href="${verificationLink}">Verify Email</a></p>
        <p>OTP expires in 10 minutes.</p>
      </div>
    `;
    await this.sendEmail({ email, subject, html });
  }

  static generateVerificationOTP() {
    return {
      otp: generateOTP(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    };
  }
}

// Create the instance first
const emailService = new EmailService();

// Then export both the class and the instance
export { EmailService, emailService };