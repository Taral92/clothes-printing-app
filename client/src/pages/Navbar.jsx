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
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-md sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      <Link
        to="/"
        className="text-2xl font-bold text-gray-800 hover:text-indigo-600 tracking-tight transition"
      >
        👕 ClothesPrint
      </Link>

      <div className="flex items-center space-x-6">
        {isAuthenticated() && (
          <Link
            to="/cart"
            className="relative group text-gray-700 hover:text-indigo-600 transition"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-ping">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {isAuthenticated() ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition shadow"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  </div>
</nav>
  );
};

export default Navbar;