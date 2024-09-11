import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/ChooseQuizPage.module.css';

interface Course {
  _id: string;
  name: string;
}

const ChooseQuizPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

        // Fetch enrolled courses for the student
        const res = await fetch(`/api/auth/enroll?userEmail=${encodeURIComponent(userEmail)}`);
        const enrolledCourses = await res.json();
        setCourses(enrolledCourses);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        alert('An error occurred while fetching data. Please try again.');
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleSelectCourse = (courseId: string) => {
    console.log('Selected course ID:', courseId);
    router.push(`/select-quiz?courseId=${courseId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.shape + ' ' + styles.shape1}></div>
      <div className={styles.shape + ' ' + styles.shape2}></div>
      <h1 className={styles.pageTitle}>Choose Course</h1>
      
      {courses.length > 0 ? (
        <>
          <h2 className={styles.sectionTitle}>Your Enrolled Courses:</h2>
          <ul className={styles.courseList}>
            {courses.map((course) => (
              <li 
                key={course._id} 
                onClick={() => handleSelectCourse(course._id)}
                className={styles.courseItem}
              >
                {course.name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className={styles.noCourses}>No enrolled courses found.</p>
      )}
    </div>
  );
};

export default ChooseQuizPage;
