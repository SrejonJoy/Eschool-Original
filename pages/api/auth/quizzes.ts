// pages/api/auth/quizzes.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';
import { Timestamp } from 'mongodb';

interface Quiz {
  _id: string;
  quizName: string;
  createdBy?: string;
  createdAt: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();

    const courseId = req.query.courseId;
    console.log('Course ID received:', courseId);

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Log all quizzes to see if there are any quizzes at all
    const allQuizzes = await db.collection('quizzes').find({}).toArray();
    console.log('All quizzes:', allQuizzes);

    // Query the database using the string course ID
    const quizzesCollection = db.collection('quizzes').find({ courseId });
    console.log('Querying quizzes collection');

    const quizzes = await quizzesCollection.toArray();
    console.log('Quizzes found:', quizzes);

    const transformedQuizzes = quizzes.map((quiz: any): Quiz => ({
      _id: quiz._id.toString(),
      quizName: quiz.quizName,
      createdBy: quiz.createdBy,
      createdAt: new Date(quiz.createdAt).toISOString(), // Convert to ISO string
    }));

    console.log('Transformed quizzes:', transformedQuizzes);

    res.status(200).json(transformedQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;