import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/EnrolledCourses.module.css'; // Import the CSS module

interface Course {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  enrolledAt: Date;
}

const EnrolledCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const storedData = localStorage.getItem('userData');
        if (!storedData) {
          alert('User data not found. Please login again.');
          router.push('/login');
          return;
        }

        const userData = JSON.parse(storedData);
        const userEmail = userData.email;

        const response = await fetch(`/api/auth/enrolled-courses?userEmail=${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        alert('An error occurred while fetching enrolled courses. Please try again.');
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>; // Use a CSS class for loading state
  }

  return (
    <div className={styles.container}> {/* Use styles from the CSS module */}
      <h1 className={styles.title}>Enrolled Courses</h1>
      {courses.length > 0 ? (
        <ul className={styles.courseList}>
          {courses.map((course) => (
            <li key={course._id} className={styles.courseCard}>
              <Link href={`/course/${course._id}`}>
                <div 
                  className={styles.thumbnail} 
                  style={{ 
                    backgroundImage: `url(${course.thumbnail})`
                  }}
                >
                  <span className={styles.courseName}>
                    {course.name}
                  </span>
                </div>
              </Link>
              <div className={styles.details}>
                <h3 className={styles.courseTitle}>{course.name}</h3>
                <p className={styles.price}>Price: ${Number(course.price).toFixed(2)}</p>
                <p className={styles.enrolledDate}>Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noCourses}>No enrolled courses found.</p>
      )}
    </div>
  );
};

export default EnrolledCoursesPage;
