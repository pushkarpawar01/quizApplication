import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_HOSTNAME}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        alert('Registration successful. Please login.');
        navigate('/login');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="container">
      <h1 className="title text-light">Quiz Application</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn">Register</button>
        </form>
        <p className="option mt-3">
          Already have an account? <a href="/login" className="link">Login</a>
        </p>
      </div>
    </div>
  );
}
