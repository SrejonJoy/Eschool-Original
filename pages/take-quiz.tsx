// pages/take-quiz.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/TakeQuizPage.module.css';

interface Question {
  title: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  _id: string;
  quizName: string;
  questions: Question[];
}

const TakeQuizPage = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('TakeQuizPage component mounted');
    const fetchQuiz = async () => {
      try {
        const quizId = router.query.quizId as string;
        console.log('Fetching quiz with ID:', quizId);

        if (!quizId) {
          throw new Error('Quiz ID is required');
        }

        const res = await fetch(`/api/auth/quiz/${quizId}`);
        console.log('Response status:', res.status);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const quizData = await res.json();
        console.log('Quiz data received:', quizData);
        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(-1));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    const correctAnswers = quiz?.questions.map((q, i) => q.correctAnswer) || [];
    const score = answers.reduce((acc, answer, index) => 
      answer === correctAnswers[index] ? acc + 1 : acc, 0);

    alert(`Quiz submitted! Your score is ${score} out of ${quiz?.questions.length || 0}`);
    // You can add more logic here to save the score or redirect to a results page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{quiz.quizName}</h1>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        {quiz.questions.map((question, index) => (
          <div key={index} className={styles.questionContainer}>
            <h3 className={styles.questionTitle}>{question.title}</h3>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className={styles.optionContainer}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={optionIndex}
                  checked={answers[index] === optionIndex}
                  onChange={() => handleAnswerChange(index, optionIndex)}
                />
                <span className={styles.optionText}>{option}</span>
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className={styles.submitButton} disabled={isSubmitted}>
          {isSubmitted ? 'Submitted' : 'Submit Quiz'}
        </button>
      </form>
    </div>
  );
};

export default TakeQuizPage;