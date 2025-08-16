import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { Axios } from "../../utils/Axios";

export const NewPassword = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 1️⃣ Check token validity when component mounts
  useEffect(() => {
    const checkToken = async () => {
      try {
        await Axios.get(`/api/password/check/${userId}/${token}`);
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Invalid or expired link");
        // navigate("/reset-password");
      }
    };
    checkToken();
  }, [userId, token, navigate]);

  // 2️⃣ Formik setup for password reset
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await Axios.post(`/api/password/reset/${userId}/${token}`, {
          password: values.password,
        });
        toast.success("Password has been reset successfully!");
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to reset password");
      }
    },
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Verifying link...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-2xl font-bold text-gray-800"
        >
          Set New Password
        </motion.h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Please enter your new password below.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-300 focus:outline-none ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.password}
              </p>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-300 focus:outline-none ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </motion.div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Save New Password
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
