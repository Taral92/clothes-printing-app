import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">ClothesPrint</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Custom clothing made simple.
            <br />
            Designed by you. Printed by us.
          </p>
        </div>

        <nav aria-label="Footer Navigation">
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/products" className="hover:text-white transition">
                Upload Design
              </Link>
            </li>
            <li>
              <Link to="/productlist" className="hover:text-white transition">
                Explore Products
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition">
                Register
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <p className="text-sm">
            📧{" "}
            <a
              href="mailto:support@clothesprint.com"
              className="hover:underline"
            >
              support@clothesprint.com
            </a>
          </p>
          <p className="text-sm mt-2">📍 Mumbai, India</p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-sm"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-sm"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-800 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-white">ClothesPrint</span>. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
