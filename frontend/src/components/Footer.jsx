import React from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange-500 p-2 rounded-lg text-white">
                <UtensilsCrossed size={20} />
              </div>

              <h2 className="text-xl font-bold text-white">
                Bite<span className="text-orange-500">Rush</span>
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              Lightning-fast food delivery experience built with MERN Stack.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">
              Quick Navigation
            </h3>

            <div className="space-y-2">

              <Link
                to="/menu"
                className="block hover:text-orange-500"
              >
                Order Online
              </Link>

              <Link
                to="/cart"
                className="block hover:text-orange-500"
              >
                Shopping Cart
              </Link>

            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">
              Tech Stack
            </h3>

            <p className="text-sm text-slate-500">
              React, Redux Toolkit, Tailwind CSS, Node.js,
              Express, MongoDB, Cloudinary and Socket.IO.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-8 pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} BiteRush. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;