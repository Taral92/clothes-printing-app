import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', { name, email, password });
      toast.success("Registered! You can now login.");
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" className="w-full mb-3 p-2 border" placeholder="Name"
          value={name} onChange={e => setName(e.target.value)} />
        <input type="email" className="w-full mb-3 p-2 border" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full mb-3 p-2 border" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-green-500 text-white py-2 rounded" type="submit">Register</button>
      </form>
      <p className="mt-3 text-sm">Already registered? <Link to="/" className="text-blue-600">Login</Link></p>
    </div>
  );
};

export default Register;