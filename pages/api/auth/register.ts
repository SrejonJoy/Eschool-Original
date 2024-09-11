import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';
import { hashPassword } from '../../../lib/hashPassword';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, id, email, phone, address, password, role } = req.body;

  const hashedPassword = await hashPassword(password);

  const { db } = await connectToDatabase();
  await db.collection('users').insertOne({
    name,
    id,
    email,
    phone,
    address,
    password: hashedPassword,
    role,
  });

  res.status(201).json({ message: 'User registered' });
};
