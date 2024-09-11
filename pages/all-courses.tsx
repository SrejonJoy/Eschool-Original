// pages/all-courses.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/AllCourses.module.css'; // Import the new CSS module

interface Course {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  userEmail: string;
}

const AllCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/auth/courses');
        const data = await response.json();

        const transformedCourses = data.map((course: any): Course => ({
          _id: course._id.toString(),
          name: course.name,
          price: parseFloat(course.price),
          thumbnail: course.thumbnail || '/s.jpg', // Fallback to a default image if thumbnail is undefined
          userEmail: course.userEmail,
        }));

        setCourses(transformedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollCourse = async (courseId: string) => {
    try {
      const response = await fetch('/api/auth/enroll-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          userEmail: router.query.email || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enroll course');
      }

      alert('Successfully enrolled in the course!');
      router.push('/welcome');
    } catch (error) {
      console.error('Error enrolling course:', error);
      alert('Failed to enroll course. Please try again.');
    }
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Courses</h1> {/* Apply styles from the module */}
      
      <input
        type="text"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.input} // Apply input styles
      />

      {filteredCourses.length > 0 ? (
        <ul className={styles.courseList}> {/* Apply styles for the list */}
          {filteredCourses.map((course) => (
            <li key={course._id} className={styles.courseCard}> {/* Apply styles for the card */}
              <Link href={`/course/${course._id}`}>
                <div 
                  className="block relative h-48 bg-cover bg-center" 
                  style={{ 
                    backgroundImage: `url(${course.thumbnail})`
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center bg-black opacity-50 text-white text-xl font-bold">
                    {course.name}
                  </span>
                </div>
              </Link>
              <div className="px-4 py-3">
                <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                <p className="text-gray-600">Price: ${Number(course.price).toFixed(2)}</p>
                <button 
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                  onClick={() => handleEnrollCourse(course._id)}
                >
                  Enroll Course
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default AllCoursesPage;
