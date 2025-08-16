import Swal from "sweetalert2";
import { login, logout } from "../Slices/authSlice";
import { toast } from "react-toastify";
import { Axios } from "../../utils/Axios";

export function LoginUser(user, navigate) {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`/api/auth/login`, user);
      dispatch(login(res.data.user));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Logged in successfully!");

      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        err?.response?.data?.errors?.password ||
          err?.response?.data?.errors?.email ||
          err?.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  };
}

export function LogOutUser() {
  return async (dispatch) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out",
    });

    if (confirm.isConfirmed) {
      try {
        dispatch(logout());
        localStorage.removeItem("user");
        toast.success("Logged out successfully!");
      } catch (err) {
        console.error("Logout error:", err);
        toast.error(
          err?.response?.data?.message || "Logout failed. Please try again."
        );
      }
    }
  };
}

export function RegisterUser(user, navigate, setApiErrors) {
  return async () => {
    try {
      const { confirmPassword, ...userData } = user; // omit confirmPassword
      const res = await Axios.post(`/api/auth/register`, userData);

      toast.success("Email verification link sent to your email!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const res = err?.response;
      const message = res?.data?.message || "Registration failed";

      // handle validation errors
      if (res?.data?.errors) {
        setApiErrors(res.data.errors); // { email: "...", username: "..." }
      } else {
        toast.error(message);
      }
    }
  };
}
