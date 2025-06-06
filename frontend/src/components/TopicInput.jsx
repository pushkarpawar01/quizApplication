import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopicInput() {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      <h1 className="title text-light">Enter Topic for Quiz</h1>
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
  );
}
