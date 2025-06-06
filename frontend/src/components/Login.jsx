import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserId } from '../redux/result_reducer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    try {
      console.log('Sending login request');
      const res = await fetch(`${import.meta.env.VITE_SERVER_HOSTNAME}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('Login response received');
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        dispatch(setUserId(data.username)); // Dispatch userId to Redux state
        // alert('Login successful');
        console.log('Login successful, navigating to /topic');
        navigate('/topic');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error');
    }
  };

  return (
    <div className="container">
      <h1 className="title text-light">Login</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="form-container">
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
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
}
