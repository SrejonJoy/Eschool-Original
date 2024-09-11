// pages/api/auth/enroll-course.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/db'
import { ObjectId } from 'mongodb'

interface EnrollmentData {
  courseId: string;
  userEmail: string;
}

async function enrollCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' })
    }

    const { db } = await connectToDatabase()
    const studentCoursesCollection = db.collection('student_course')
    const usersCollection = db.collection('users') // Assuming users collection exists

    const { courseId, userEmail } = req.body as EnrollmentData

    console.log('Received enrollment data:', { courseId, userEmail })

    // Check if the course and user email are provided
    if (!courseId || !userEmail) {
      console.error('Missing required fields:', { courseId, userEmail })
      return res.status(400).json({ message: 'Course ID and user email are required' })
    }

    // Check if the course exists
    const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) })
    if (!course) {
      console.error('Course not found:', courseId)
      return res.status(404).json({ message: 'Course not found' })
    }

    // Check if the user is already enrolled in the course
    const existingEnrollment = await studentCoursesCollection.findOne({
      courseId: new ObjectId(courseId),
      userEmail
    })
    if (existingEnrollment) {
      console.error('User already enrolled:', { courseId, userEmail })
      return res.status(400).json({ message: 'You are already enrolled in this course' })
    }

    // Fetch user role
    const user = await usersCollection.findOne({ email: userEmail })
    if (!user) {
      console.error('User not found:', userEmail)
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the user is a teacher
    if (user.role === 'teacher') {
      console.error('Teacher attempting to enroll:', { userEmail, courseId })
      return res.status(403).json({ message: 'Teachers cannot enroll in courses' })
    }

    // Insert the enrollment record
    const result = await studentCoursesCollection.insertOne({
      courseId: new ObjectId(courseId),
      userEmail,
      enrolledAt: new Date()
    })

    console.log('Enrollment successful:', { courseId, userEmail })
    res.status(201).json({ 
      message: 'Successfully enrolled in the course', 
      courseId: courseId,
      userEmail: userEmail
    })
  } catch (error) {
    console.error('Error enrolling course:', error)
    res.status(500).json({ message: 'Failed to enroll course' })
  }
}

export default enrollCourse