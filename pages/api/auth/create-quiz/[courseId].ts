// pages/api/auth/create-quiz/[courseId].ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const courseId = req.query.courseId

  if (!courseId || typeof courseId !== 'string') {
    return res.status(400).json({ error: 'Invalid course ID' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()
    const quizzesCollection = db.collection('quizzes')

    const quizData = req.body

    console.log('Received Quiz Data:', quizData);

    // Handle potential missing fields
    const safeQuizData = {
      ...quizData,
      courseId,
      createdAt: new Date(),
      createdBy: quizData.createdBy || '',
      userEmail: quizData.userEmail || '',
    }

    const result = await quizzesCollection.insertOne(safeQuizData)
    
    console.log('Before Insertion:', safeQuizData);

    console.log('Insertion Result:', result);
    
    res.status(201).json({ message: 'Quiz created successfully', id: result.insertedId })
  } catch (error) {
    console.error('Error creating quiz:', error instanceof Error ? error.message : String(error))
    res.status(500).json({ message: 'Failed to create quiz' })
  }
}

export default handler