// pages/api/user-results.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { db } = await connectToDatabase();
    
    const userEmail = req.query.email as string;
    const user = await db.collection('users').findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userResults = await db
      .collection('results')
      .find({ userId: user._id })
      .toArray();
    
    const formattedResults = userResults.map(result => ({
      courseId: result.courseId,
      courseName: result.courseName,
      grade: result.grade
    }));
    
    res.status(200).json({ grades: formattedResults });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}