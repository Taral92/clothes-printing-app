import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setToken } from "../utils/auth";
import { setCart } from "../redux/slice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🔐 Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          No account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium underline hover:text-indigo-800">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;