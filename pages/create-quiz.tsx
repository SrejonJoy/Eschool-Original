// pages/create-quiz.tsx

import { useState } from 'react'
import { useRouter } from 'next/router'

interface Question {
  title: string;
  options: string[];
  correctAnswer: number;
}

const CreateQuizPage = () => {
  const [quizName, setQuizName] = useState('')
  const [questions, setQuestions] = useState<Question[]>([{ title: '', options: ['', '', '', ''], correctAnswer: -1 }])
  const router = useRouter()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const storedData = localStorage.getItem('userData')
    if (!storedData) {
      alert('User data not found. Please login again.')
      router.push('/login')
      return
    }
    
    const userData = JSON.parse(storedData)
    const teacherEmail = userData.email
    
    const courseId = router.query.courseId as string

    try {
      const response = await fetch('/api/auth/create-quiz${courseId}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizName,
          questions,
          courseId,
          createdBy: userData.name,
          userEmail: teacherEmail
        }),
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

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Quiz</h2>
      <input
        type="text"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        placeholder="Enter quiz name"
        required
      />
      
      {questions.map((question, index) => (
        <div key={index}>
          <input
            type="text"
            value={question.title}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            placeholder={`Question ${index + 1}`}
            required
          />
          
          <div>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  required
                />
                
                <input
                  type="radio"
                  checked={question.correctAnswer === optionIndex}
                  onChange={() => handleCorrectAnswerChange(index, optionIndex)}
                /> Correct Answer
              </div>
            ))}
          </div>

          <button type="button" onClick={() => handleRemoveQuestion(index)} disabled={index === 0}>
            Remove Question
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddQuestion}>Add Question</button>

      <button type="submit">Submit Quiz</button>
    </form>
  )
}

export default CreateQuizPage