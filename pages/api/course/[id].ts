// pages/api/course/[id].ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/db'
import { ObjectId } from 'mongodb'

interface Course {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  userEmail: string;
  videos: Array<{ title: string; url: string }>
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase()
    const coursesCollection = db.collection('courses')

    const courseId = req.query.id as string
    const courseData = await coursesCollection.findOne({ _id: new ObjectId(courseId) })

    if (!courseData) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const course: Course = {
      _id: courseData._id.toString(),
      name: courseData.name,
      price: courseData.price,
      thumbnail: courseData.thumbnail,
      userEmail: courseData.userEmail,
      videos: courseData.videos || []
    }

    res.status(200).json(course)
  } catch (error) {
    console.error('Error fetching course details:', error)
    res.status(500).json({ message: 'An error occurred while fetching course details' })
  }
}