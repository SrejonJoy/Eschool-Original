import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, id, email, phone, address } = req.body;

  const { db } = await connectToDatabase();
  await db.collection('users').updateOne(
    { email },
    { $set: { name, id, phone, address } }
  );

  res.status(200).json({ message: 'Profile updated' });
};
