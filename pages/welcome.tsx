// pages/welcome.tsx

// pages/welcome.tsx

import styles from '../styles/WelcomePage.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const WelcomePage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('userData');
        console.log('Stored data:', storedData);
        const initialData = JSON.parse(storedData || '{}');

        // Fetch user data based on email
        const res = await fetch(`/api/auth/get-user-data?email=${initialData.email}`);
        const userData = await res.json();
        console.log('Fetched user data:', userData);
        setUserData(userData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError('Error loading user data');
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const username = userData?.name || userData?.email || '';
  const userRole = userData?.role || '';
  console.log('Stored data:', userData?.email)

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('userData');

      // Fetch user data again after clearing local storage
      const res = await fetch(`/api/auth/get-user-data?email=${userData.email}`);
      const updatedUserData = await res.json();

      // Update state with fetched data
      setUserData(updatedUserData);
      
      // Redirect to login page
      router.replace('/login');
    } catch (err) {
      console.error("Error during logout:", err);
      setError('An error occurred while logging out.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {username ? `Welcome, ${username}` : 'Welcome!'}
      </h1>
      <p className={styles.userRole}>{userRole ? `Your Role: ${userRole}` : 'No role assigned'}</p>
      <div className={styles.buttonGroup}>
      <button className={styles.button} onClick={handleLogout}>Logout</button>
        <Link href="/edit-profile" className={styles.btnLink}>Edit Profile</Link>
        {userRole === 'teacher' && (
          <>
            <button className={styles.createCourseButton} onClick={() => router.push('/create-course')}>
              Create Course
            </button>
            <button className={styles.createQuizButton} onClick={() => router.push('/select-course')}>
              Create Quiz
            </button>
          </>
        )}
        <Link 
          href={{
            pathname: '/all-courses',
            query: { email: userData?.email, role: userData?.role } // Pass email and role
          }} 
          className={styles.viewAllCoursesButton}
        >
          View All Courses
        </Link>
        <Link href="/about" className={styles.aboutButton}>
              About
            </Link>
        {userRole === 'student' && (
          <>
            <Link href="/enrolled-courses" className={styles.enrolledCoursesButton}>
              Enrolled Courses
            </Link>
            <Link href="/choose-quiz" className={styles.quizButton}>
              Quiz
            </Link>
            <Link href="/results" className={styles.resultsButton}>
              Results
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default WelcomePage;
