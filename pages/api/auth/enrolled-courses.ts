import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { db } = await connectToDatabase();
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const studentCoursesCollection = db.collection('student_course');
    const coursesCollection = db.collection('courses');

    const enrolledCourses = await studentCoursesCollection.find({ userEmail }).toArray();

    const courseDetails = await Promise.all(enrolledCourses.map(async (enrollment) => {
      const course = await coursesCollection.findOne({ _id: new ObjectId(enrollment.courseId) });
      if (course) {
        return {
          _id: course._id.toString(),
          name: course.name,
          price: course.price,
          thumbnail: course.thumbnail,
          enrolledAt: enrollment.enrolledAt,
        };
      }
      return null;
    }));

    const filteredCourses = courseDetails.filter(course => course !== null);

    res.status(200).json(filteredCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
}
