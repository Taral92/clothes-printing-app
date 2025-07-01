import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-[#e6f0ff] flex flex-col justify-between font-sans">
      <div className="flex-grow flex items-center justify-center px-6 py-16">
        <div className="max-w-7xl w-full flex flex-col-reverse md:flex-row items-center gap-16">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              Design <span className="text-blue-600">What You Wear</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-lg leading-relaxed">
              Upload your custom ideas. We print it. You wear it. Express your
              style like never before.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/products")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow-md transition duration-300"
              >
                Upload Your Design
              </button>

              <button
                onClick={() => navigate("/productlist")}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 text-lg px-6 py-3 rounded-xl transition"
              >
                Explore Products
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate("/tshirtmockup")}
                className="w-full sm:w-auto bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white text-lg font-semibold px-6 py-3 rounded-xl shadow transition duration-300"
              >
                View Mockups
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex justify-end"
          >
            <img
              src="https://img.freepik.com/free-photo/young-stylish-sexy-woman-cinema-backstage_285396-7573.jpg?ga=GA1.1.1916049219.1750497840&semt=ais_hybrid&w=740"
              alt="Design preview"
              className="w-full max-w-md h-[800px] md:max-w-lg rounded-xl object-cover border border-gray-200 shadow-lg hover:scale-[1.02] transition duration-300 ease-in-out"
            />
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;
