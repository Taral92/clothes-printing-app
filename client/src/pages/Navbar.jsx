import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isAuthenticated, logout } from "../utils/auth";
import { toast } from "react-toastify";
import { clearCart } from "../redux/slice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.z.cartItems);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(clearCart());
    logout();
    toast.success("👋 Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight text-indigo-700 hover:text-indigo-900 transition"
        >
          👕 ClothesPrint
        </Link>

       
        <div className="flex items-center gap-6">
          {isAuthenticated() && (
            <>
              
              <Link
                to="/orders"
                className="text-gray-700 hover:text-indigo-600 font-medium transition"
              >
                📋 Orders
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="relative group">
                <span className="text-2xl hover:text-indigo-600 transition">
                  🛒
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Auth Buttons */}
          {isAuthenticated() ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-indigo-700 transition shadow"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;