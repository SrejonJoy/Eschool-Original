// lib/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider here
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail(email: string, subject: string, text: string) {
  try {
    const info = await transporter.sendMail({
      from: '"Eschool" <no-reply@eschool.com>', // From email
      to: email, // To email
      subject: subject, // Subject line
      text: text, // Plain text body
    });
    console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
}