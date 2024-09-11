// pages/api/auth/submit-result.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';

interface Result {
  studentEmail: string;
  quizId: string;
  result: number;
  courseId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const resultsCollection = db.collection('results');

    const { studentEmail, quizId, result, courseId } = req.body as Result;

    // Check if the student has already taken the quiz
    const existingResult = await resultsCollection.findOne({
      studentEmail,
      quizId,
    });

    if (existingResult) {
      return res.status(400).json({ message: 'Quiz already taken' });
    }

    // Insert new result
    const resultToInsert = {
      studentEmail,
      quizId,
      result,
      courseId,
      createdAt: new Date(),
    };

    const insertResult = await resultsCollection.insertOne(resultToInsert);
    const insertedId = insertResult.insertedId;

    res.status(201).json({ message: 'Result submitted successfully', id: insertedId });
  } catch (error) {
    console.error('Error submitting result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}