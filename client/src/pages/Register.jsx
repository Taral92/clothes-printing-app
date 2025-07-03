import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trimStart() });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password } = form;

    if (!name || !email || !password) {
      toast.warn("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (!isValidPassword(password)) {
      toast.error(
        "Password must be at least 6 characters and contain letters and numbers"
      );
      return;
    }

    setLoading(true);

    try {
      await axios.post("https://clothes-printing-backend.onrender.com/api/auth/register", form);
      toast.success("🎉 Registered successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500 w-14 h-14 flex items-center justify-center rounded-full shadow-lg">
          <span className="text-white text-2xl">📝</span>
        </div>
  
        <h2 className="text-3xl font-bold text-white text-center mb-6 mt-4 tracking-wide">
          Create an Account
        </h2>
  
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
  
          <div>
            <label className="block text-white text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
  
          <div>
            <label className="block text-white text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
  
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/50 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
  
        <p className="mt-6 text-center text-sm text-white/80">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300 underline transition"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
