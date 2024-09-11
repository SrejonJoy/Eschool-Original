import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';
import { sendEmail } from '../../../lib/sendEmail';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to database
  const { db } = await connectToDatabase();
  await db.collection('otps').insertOne({ email, otp, createdAt: new Date() });

  // Send OTP email
  await sendEmail(email,"This is Test",`Your OTP code is ${otp}`);

  res.status(200).json({ message: 'OTP sent' });
};
