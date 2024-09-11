// pages/api/create-course.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/db'

console.log('API route /api/create-course loaded');

async function createCourse(req: NextApiRequest, res: NextApiResponse) {
  console.log('createCourse function called');
  
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()
    const coursesCollection = db.collection('courses')

    console.log('Connected to database');

    const { courseId,name, price, thumbnailUrl, videos, userEmail } = req.body

    console.log('Received data:', { name, price, thumbnailUrl, videos, userEmail });

    const newCourse = {
      courseId,
      name,
      price,
      thumbnailUrl,
      videos,
      userEmail,
      createdAt: new Date(),
    }

    const result = await coursesCollection.insertOne(newCourse)
    console.log('Course inserted:', result);
    res.status(201).json({ message: 'Course created successfully', id: result.insertedId })
  } catch (error) {
    console.error('Error creating course:', error instanceof Error ? error.message : String(error))
    res.status(500).json({ message: 'Failed to create course' })
  }
}

export default createCourse