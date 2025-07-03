import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";
import { isAuthenticated, getToken } from "../utils/auth";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const Landing = () => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (!isAuthenticated()) {
      toast.warn("⚠️ Please login to upload your design.");
      navigate("/login");
      return;
    }

    try {
      const token = getToken();
      const decoded = jwtDecode(token);

      if (decoded?.role !== "admin") {
        toast.error("❌ You are not an admin. Access denied.");
        return;
      }

      navigate("/products");
    } catch (err) {
      toast.error("Something went wrong. Please login again.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white flex flex-col font-sans">
      <div className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl w-full flex flex-col-reverse md:flex-row items-center gap-16">
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-1"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Design <span className="text-indigo-400">What You Wear</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
              Upload your boldest ideas. We print it with precision. Make a
              fashion statement that’s uniquely you. Premium designs, zero
              compromise.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleUploadClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium px-6 py-3 rounded-xl shadow-xl transition duration-300"
              >
                Upload Your Design
              </button>

              <button
                onClick={() => navigate("/productlist")}
                className="border border-gray-400 hover:border-gray-200 text-gray-200 hover:text-white text-lg px-6 py-3 rounded-xl transition duration-300"
              >
                Explore Products
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate("/tshirtmockup")}
                className="bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold text-lg px-6 py-3 rounded-xl shadow transition duration-300"
              >
                View Mockups
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-full max-w-md md:max-w-lg overflow-hidden rounded-2xl shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1527736947477-2790e28f3443?w=800&auto=format&fit=crop&q=80"
                alt="Design preview"
                className="w-full h-[500px] object-cover rounded-2xl transition-transform duration-500 ease-in-out hover:scale-105 shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;