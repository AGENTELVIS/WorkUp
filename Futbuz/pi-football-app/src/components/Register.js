import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register({ setIsAuthenticated }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const { username, email, password, confirmPassword } = formData;
        if (!username || !email || !password || !confirmPassword) {
            setMessage('Please fill all fields');
            return false;
        }
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return false;
        }
        
        return true;
    };

    const handleRegister = async (event) => {
        event.preventDefault();
    
        if (!validateForm()) return;
    
        setIsLoading(true);
        setMessage('');
    
        try {
            const response = await fetch('http://localhost:4001/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
            setMessage('An error occurred during registration');
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="justify-center text-center w-1/3 m-3 p-3 shadow-xl border-2 border-neutral-800">
                <h2 className="font-bold text-lg">Register</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="border border-neutral-800 m-2.5 p-1"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-neutral-800 m-2.5 p-1 "
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border border-neutral-800 m-2.5 p-1 "
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="border border-neutral-800 m-2.5 p-1 "
                        required
                    /><br />
                    <button
                        type="submit"
                        className="mb-5 mt-1 hover:bg-blue-400 m-2.5 p-2 border border-neutral-800 "
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className='text-sm'>Already Registered?</p>
                <Link to="/signin">
                    <button className='text-sm font-semibold mb-1 hover:text-blue-700'>
                        Sign In!
                    </button>
                </Link>
                {message && <p className="text-red-600 font-semibold mt-2">{message}</p>}

                
            </div>
        </div>
    );
}

export default Register;