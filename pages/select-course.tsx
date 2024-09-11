// pages/select-course.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/SelectCourse.module.css'; // Import the CSS

// Define an interface for the Course object
interface Course {
  _id: string;
  name: string;
  userEmail: string;
  // Add any other fields that your course object might have
}

const SelectCoursePage = () => {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTeacherEmailAndCourses = async () => {
      // Fetch teacher's email from local storage
      const storedData = localStorage.getItem('userData');
      if (!storedData) {
        alert('User data not found. Please login again.');
        router.push('/login');
        return;
      }
      
      const userData = JSON.parse(storedData);
      const teacherEmail = userData.email;
      
      // Fetch courses created by this teacher
      const res = await fetch(`/api/auth/courses?teacherEmail=${teacherEmail}`);
      const teacherCourses = await res.json() as Course[];
      
      setCourses(teacherCourses);
    };

    fetchTeacherEmailAndCourses();
  }, []);

  const handleSelectCourse = async (courseId: string) => {
    setSelectedCourseId(courseId);
    
    // Redirect to quiz creation page
    router.push(`/create-quiz/${courseId}`);
  };

  return (
    <div className={styles.container}>
      <h2>Select Course</h2>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course._id}>
              <button onClick={() => handleSelectCourse(course._id)}>
                {course.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
};

export default SelectCoursePage;
