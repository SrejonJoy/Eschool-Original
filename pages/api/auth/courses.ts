// pages/api/auth/courses.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()

    // Get teacher email from query params
    const teacherEmail = req.query.teacherEmail

    let coursesCollection;
    if (teacherEmail) {
      // Fetch courses created by the specific teacher
      coursesCollection = db.collection('courses').find({ userEmail: teacherEmail });
    } else {
      // Fetch all courses if no teacher email is provided
      coursesCollection = db.collection('courses').find();
    }

    const courses = await coursesCollection.toArray()
    
    res.status(200).json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default handler