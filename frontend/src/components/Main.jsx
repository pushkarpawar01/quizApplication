import React, { useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setUserId } from '../redux/result_reducer'
import '../styles/Main.css'

export default function Main() {
  const inputRef = useRef(null)
  const dispatch = useDispatch()

  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || '';
    setUsername(storedUsername);
  }, []);

  function startQuiz(){
      if(inputRef.current?.value){
          dispatch(setUserId(inputRef.current?.value))
      }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    setError('');
    // Save topic to localStorage or context for quiz fetching
    localStorage.setItem('quizTopic', topic.trim());
    navigate('/quiz');
  };

  return (
      <div className="container">
      <h2 className='title text-light'>Quiz Application</h2>
      <div className='container1'>
      
      <h1 className='text-light'>Welcome, {username}!</h1>
      <ol>
          <li>You will be asked 10 questions one after another.</li>
          <li>10 points is awarded for the correct answer.</li>
          <li>Each question has three options. You can choose only one options.</li>
          <li>You can review and change answers before the quiz finish.</li>
          <li>The result will be declared at the end of the quiz.</li>
      </ol>

      <div className="container">
        <h1 className="heading text-light">Enter Topic for Quiz</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input"
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn">Start Quiz</button>
        </form>
      </div>

    </div>
    </div>
    
  )
}
