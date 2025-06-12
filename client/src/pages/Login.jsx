import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setToken } from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      setToken(res.data.token);
    
      toast.success(`${res.data.user} logged in successfully`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" className="w-full mb-3 p-2 border" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full mb-3 p-2 border" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-blue-500 text-white py-2 rounded" type="submit">Login</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
    </div>
  );
};

export default Login;