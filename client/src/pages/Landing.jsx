import React from 'react';
import axios from 'axios';

const Landing = () => {
const username=axios.get('http://localhost:3000/api/user')
console.log(username)
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-100 to-blue-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, {username} 👕</h1>
      <p className="mb-6 text-lg text-gray-600">Let's start designing your clothes!</p>
      <a
        href="/upload"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Upload Your Design
      </a>
    </div>
  );
};

export default Landing;

