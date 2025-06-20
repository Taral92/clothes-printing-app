import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAuthenticated, logout } from "../utils/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/slice";
const Navbar = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.z.cartItems);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearCart());
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold text-white">
          MyStore
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated() && (
          <Link to="/cart" className="relative">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {isAuthenticated() ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
