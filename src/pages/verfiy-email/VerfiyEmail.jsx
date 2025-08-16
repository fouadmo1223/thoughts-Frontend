import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { Axios } from "../../utils/Axios";

export const VerifyEmail = () => {
  const { userId, token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getIsVerified = async () => {
    try {
      const res = await Axios.get(`/api/auth/${userId}/verfiy/${token}`);
      if (res.data.success) {
        setVerified(true);
        setErrorMessage("");
        // 🎊 Confetti after success
        setTimeout(() => {
          confetti({
            particleCount: 120,
            spread: 100,
            origin: { y: 0.6 },
          });
        }, 500);
      } else {
        setVerified(false);
        setErrorMessage(res.data.message || "Verification failed.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerified(false);
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getIsVerified();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse mb-4"></div>
          <p className="text-gray-500 animate-pulse">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      {verified ? (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Floating glowing icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-4 drop-shadow-lg" />
          </motion.div>

          {/* Text animation */}
          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            You are verified! 🎉
          </motion.h1>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your email has been successfully verified.
          </motion.p>

          {/* Button animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Go to Login
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Shake animation for fail icon */}
          <motion.div
            animate={{ x: [0, -5, 5, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <XCircle className="text-red-500 w-24 h-24 mx-auto mb-4 drop-shadow-lg" />
          </motion.div>

          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Verification Failed ❌
          </motion.h1>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {errorMessage}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Go to Login
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
