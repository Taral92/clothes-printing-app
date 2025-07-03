import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setToken } from "../utils/auth";
import { setCart } from "../redux/slice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

  const handleLogin = async (e) => {
    e.preventDefault();

    const isSpecialUser = email === "taral999@gmail.com";

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isSpecialUser && !isValidPassword(password)) {
      toast.error(
        "Password must be at least 6 characters and include both letters and numbers."
      );
      return;
    }

    if (isSpecialUser && password !== "taral") {
      toast.error("Incorrect password for special user.");
      return;
    }

    try {
      const res = await axios.post("https://clothes-printing-backend.onrender.com/api/auth/login", {
        email,
        password,
      });

      setToken(res.data.token);
      toast.success(`${res.data.user} logged in successfully`);

      dispatch(
        setCart(
          res.data.cart.map((item) => ({
            ...item.productId,
            id: item.productId._id,
            quantity: item.quantity,
          }))
        )
      );

      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500 w-14 h-14 flex items-center justify-center rounded-full shadow-lg">
          <span className="text-white text-2xl">🔐</span>
        </div>
  
        <h2 className="text-3xl font-bold text-white text-center mb-6 mt-4 tracking-wide">
          Welcome Back
        </h2>
  
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
  
          <div>
            <label className="block text-white text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/50"
          >
            Sign In
          </button>
        </form>
  
        <p className="mt-6 text-center text-sm text-white/80">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 underline transition"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
