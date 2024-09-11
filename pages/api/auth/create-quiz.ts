// pages/api/auth/create-quiz.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/db'

async function createQuiz(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()
    const quizzesCollection = db.collection('quizzes')

    const { 
      quizName, 
      questions, 
      courseId, 
      createdBy, 
      userEmail 
    } = req.body

    const newQuiz = {
      quizName,
      questions,
      courseId,
      createdAt: new Date(),
      createdBy,
      userEmail
    }

    const result = await quizzesCollection.insertOne(newQuiz)
    
    res.status(201).json({ message: 'Quiz created successfully', id: result.insertedId })
  } catch (error) {
    console.error('Error creating quiz:', error instanceof Error ? error.message : String(error))
    res.status(500).json({ message: 'Failed to create quiz' })
  }
}

export default createQuiz