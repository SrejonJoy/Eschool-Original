// pages/api/auth/get-user-data.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      
      const email = req.query.email as string;
      const user = await db.collection('users').findOne({ email });

      if (user) {
        delete user.password; // Remove sensitive information
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user details' });
    }
  } else {
    res.status(405).end();
  }
}