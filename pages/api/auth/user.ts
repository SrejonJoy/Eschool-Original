import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();

    // Assuming you're using user authentication and the user's email is in req.query
    const userEmail = req.query.email;

    const user = await db.collection('users').findOne({ email: userEmail });

    if (user) {
      res.status(200).json({
        name: user.name,
        id: user.id,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
