import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    const { email, password } = formData;

    if (email && password) {
      try {
        const response = await fetch('http://localhost:4001/user/signin', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          setIsAuthenticated(true);
          navigate('/');
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred during sign-in');
      }
    } else {
      setMessage('Please fill all the fields');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="justify-center text-center w-1/3 m-3 p-3 shadow-xl border-2 border-neutral-800">
        <h2 className="font-bold text-lg">Sign In</h2>
        <input
          type="email"
          className="border border-neutral-800 m-2.5 p-1"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        /><br/>
        <input
          type="password"
          className="border border-neutral-800 m-2.5 p-1"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        /><br/>
        <button className="mb-5 mt-1 hover:bg-blue-400 m-2.5 p-2 border border-neutral-800" onClick={handleSignIn}>Sign In</button><br/>
        <p className='text-sm'>Not Registered?</p>
        <Link to="/register">
          <button className='text-sm mb-1 text-decoration-line: underline hover:text-blue-700'>Register!</button>
        </Link>
        <p className='text-red-600'>{message}</p>
      </div>
    </div>
  );
}
