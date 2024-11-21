import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import passwordIcon from '../assets/password.jpg';
import userIcon from '../assets/user.jpg'; // Assuming you have a user icon here

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: userName,
        password: password,
      });
  
      // Extract tokens from the response
      const { access, refresh, customer_id } = response.data;
  
      // Store tokens in localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
  
      // Store customer_id if provided
      if (customer_id) {
        localStorage.setItem('customer_id', customer_id); // Save customer ID in localStorage
      } else {
        console.warn('Customer ID not provided in the login response.');
      }
  
      // Handle roles (if any) from the token
      const decodedToken = JSON.parse(atob(access.split('.')[1]));
      if (decodedToken.role) {
        localStorage.setItem('role', decodedToken.role);
      }
  
      alert("Login successful!");
      setError('');
  
      // Navigate to the homepage or dashboard
      navigate('/');
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Login</h2>
          <div className="h-1 w-24 bg-rose-400 mx-auto mt-2"></div>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex items-center border-b border-gray-300 py-2">
            <img src={userIcon} alt="User Icon" className="h-6 w-6 mr-3" />
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2">
            <img src={passwordIcon} alt="Password Icon" className="h-6 w-6 mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-rose-400 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Log in
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
