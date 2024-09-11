import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, otp } = req.body;

  const { db } = await connectToDatabase();
  const record = await db.collection('otps').findOne({ email, otp });

  if (!record) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  res.status(200).json({ message: 'OTP verified' });
};
