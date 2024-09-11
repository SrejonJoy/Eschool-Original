import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/SelectQuizPage.module.css';

interface Quiz {
  _id: string;
  quizName: string;
  questions: any[];
  courseId: string;
  createdBy: string;
  userEmail: string;
  createdAt: string;
}

const SelectQuizPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const courseId = router.query.courseId as string;
        console.log('Course ID in select-quiz.tsx:', courseId);
        if (!courseId) {
          alert('Course ID is required');
          router.push('/welcome');
          return;
        }

        const res = await fetch(`/api/auth/quizzes?courseId=${encodeURIComponent(courseId)}`);
        const quizData = await res.json();
        console.log('Quiz data received:', quizData);
        setQuizzes(quizData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        alert('Failed to fetch quizzes. Please try again.');
        router.push('/welcome');
      }
    };

    fetchQuizzes();
  }, [router.query.courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.shape + ' ' + styles.shape1}></div>
      <div className={styles.shape + ' ' + styles.shape2}></div>
      <h1 className={styles.pageTitle}>Select Quiz</h1>
      
      {quizzes.length > 0 ? (
        <ul className={styles.quizList}>
          {quizzes.map((quiz) => (
            <li key={quiz._id} className={styles.quizItem}>
              <Link href={`/take-quiz/${quiz._id}`} className={styles.quizLink}>
                {quiz.quizName}
              </Link>
              <p className={styles.quizDetails}>
                Created by: {quiz.createdBy} on {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noQuizzes}>No quizzes found for this course.</p>
      )}
    </div>
  );
};

export default SelectQuizPage;
