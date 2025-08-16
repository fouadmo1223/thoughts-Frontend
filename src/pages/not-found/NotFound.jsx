import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <img
        src="https://img.freepik.com/free-vector/hand-drawn-404-error_23-2147746234.jpg?semt=ais_hybrid&w=740"
        alt="404 Illustration"
        className="w-80 h-auto object-contain mb-6 rounded-lg shadow-md"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        Sorry, the page you’re looking for might have been moved or doesn’t
        exist.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
