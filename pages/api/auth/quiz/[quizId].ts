// pages/api/auth/[quizId].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/db';
import { ObjectId } from 'mongodb';

interface Quiz {
  _id: string;
  quizName: string;
  questions: {
    title: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const quizId = req.query.quizId as string;

    if (!quizId) {
      return res.status(400).json({ message: 'Quiz ID is required' });
    }

    console.log('Attempting to fetch quiz with ID:', quizId);

    try {
      const objectId = new ObjectId(quizId);
      console.log('Converted to ObjectId:', objectId);

      const quiz = await db.collection('quizzes').findOne({ _id: objectId });

      if (!quiz) {
        console.log('Quiz not found in database');
        return res.status(404).json({ message: 'Quiz not found' });
      }

      console.log('Quiz found:', quiz);
      res.status(200).json(quiz);
    } catch (objectIdError) {
      console.error('Invalid quiz ID:', objectIdError);
      return res.status(400).json({ message: 'Invalid quiz ID' });
    }
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}