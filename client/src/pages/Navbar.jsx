import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <div className="flex items-center space-x-4 ">
        {
          isAuthenticated() ? (
            <button onClick={handleLogout} className="bg-red-600 px-4 py-1 rounded">
              Logout
            </button>
          ) : (
            <>
              <Link to="/" className="mr-4">
                Login
              </Link>
              <Link to="/register">Register</Link>
            </>
          )
        }
      </div>
    </nav>
  );
};

export default Navbar;
