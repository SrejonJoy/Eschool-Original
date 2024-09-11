// pages/api/auth/courses.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/db'

interface Course {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  userEmail: string;
  // Add any other relevant fields
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()

    // Get teacher email from query params
    const teacherEmail = req.query.teacherEmail as string | undefined

    let coursesCollection;
    if (teacherEmail) {
      // Fetch courses created by the specific teacher
      coursesCollection = db.collection('courses').find({ userEmail: teacherEmail });
    } else {
      // Fetch all courses if no teacher email is provided
      coursesCollection = db.collection('courses').find();
    }

    const courses = await coursesCollection.toArray()

    // Transform the data to match the expected Course type
    const transformedCourses = courses.map((course: any): Course => ({
      _id: course._id.toString(),
      name: course.name,
      price: parseFloat(course.price),
      thumbnail: course.thumbnail,
      userEmail: course.userEmail
    }))

    res.status(200).json(transformedCourses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default handler