import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/CreateQuiz.module.css' // Import the CSS module

interface Question {
  title: string;
  options: string[];
  correctAnswer: number;
}

interface User {
  email: string;
  name: string;
}

const CreateQuizPage = () => {
  const router = useRouter()
  const courseId = router.query.courseId as string

  const [quizName, setQuizName] = useState('')
  const [questions, setQuestions] = useState<Question[]>([{ title: '', options: ['', '', '', ''], correctAnswer: -1 }])
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)  // Store user data in state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = localStorage.getItem('userData')
        if (!storedData) {
          alert('User data not found. Please login again.')
          router.push('/login')
          return
        }
        
        const parsedUserData = JSON.parse(storedData) as User
        setUserData(parsedUserData)  // Set user data in state
        const teacherEmail = parsedUserData.email

        // Fetch user name from database
        const res = await fetch(`/api/auth/get-user-name?email=${teacherEmail}`)
        const { name } = await res.json()
        
        setUserName(name)
      } catch (error) {
        console.error('Error fetching user data:', error)
        alert('An error occurred while fetching user data.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loading || !userName) {
      alert('Please wait while we fetch your data.')
      return
    }

    try {
      const quizData = {
        quizName,
        questions,
        courseId,
        createdBy: userName,
        userEmail: userData?.email || '',  // Access userData from state
      }

      const response = await fetch(`/api/auth/create-quiz/${courseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),
      })

      if (!response.ok) {
        throw new Error('Failed to create quiz')
      }

      const data = await response.json()
      alert('Quiz created successfully!')
      
      router.push('/welcome')
    } catch (error) {
      console.error('Error creating quiz:', error)
      alert('An error occurred while creating the quiz. Please try again.')
    }
  }

  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, { title: '', options: ['', '', '', ''], correctAnswer: -1 }])
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions(prev => 
      prev.map((q, i) => 
        i === index ? { ...q, title: value } : q
      )
    )
  }

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions(prev => 
      prev.map((q, i) => 
        i === questionIndex ? 
          { ...q, options: q.options.map((o, j) => j === optionIndex ? value : o) } 
          : q
      )
    )
  }

  const handleCorrectAnswerChange = (index: number, value: number) => {
    setQuestions(prev => 
      prev.map((q, i) => 
        i === index ? { ...q, correctAnswer: value } : q
      )
    )
  }

  return (
    <div className={styles.container}>
      <h1>Create Quiz for Course: {courseId}</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="quizName">Quiz Name:</label>
          <input
            type="text"
            id="quizName"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </div>

        {questions.map((question, index) => (
          <div key={index}>
            <h3>Question {index + 1}</h3>
            <div>
              <label htmlFor={`question-${index}`}>Question:</label>
              <input
                type="text"
                id={`question-${index}`}
                value={question.title}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                required
              />
            </div>

            <div className={styles.options}>Options:</div>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className={styles.option}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  required
                />
                <label>
                  <input
                    type="radio"
                    checked={question.correctAnswer === optionIndex}
                    onChange={() => handleCorrectAnswerChange(index, optionIndex)}
                  /> Correct Answer
                </label>
              </div>
            ))}

            {index > 0 && (
              <button type="button" className={styles.remove-question-button} onClick={() => handleRemoveQuestion(index)}>
                Remove Question
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion}>Add Question</button>

        <button type="submit">Create Quiz</button>
      </form>
    </div>
  )
}

export default CreateQuizPage
