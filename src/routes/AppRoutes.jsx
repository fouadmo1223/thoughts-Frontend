import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "../componnents/PageWrapper";
import Home from "../pages/home/Home";
import { Posts } from "../pages/posts/Posts";
import PostsLayout from "../pages/posts/PostsLayout ";
import { CreatePost } from "../pages/create-post/CreatePost";
import { PostDetails } from "../pages/post-daetalis/PostDetails";
import { Categories } from "../pages/categories/Categories";
import SelectedCatPosts from "../pages/categories/SelectedCatPosts";
import { Profile } from "../pages/Profile/Profile";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminCategories from "../pages/admin/Categories";
import AdminHome from "../pages/admin/AdminHome";
import Users from "../pages/admin/Users";
import Comments from "../pages/admin/Comments";
import AdminPosts from "../pages/admin/AdminPosts";

import LoginForm from "../pages/login/LoginForm";
import RegisterForm from "../pages/signup/RegisterForm";
import NotFound from "../pages/not-found/NotFound";
import { useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import { VerifyEmail } from "../pages/verfiy-email/VerfiyEmail";
import { ResetPassword } from "../pages/resetPassword/ResetPassword";
import { NewPassword } from "../pages/newPassord/NewPassword";
import Services from "../pages/services/Services";
import Contact from "../pages/contact/Contact";

const AppRoutes = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            !user ? (
              <PageWrapper>
                <LoginForm />
              </PageWrapper>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/verfiy-email/:userId/verfiy/:token"
          element={
            !user ? (
              <PageWrapper>
                <VerifyEmail />
              </PageWrapper>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/register"
          element={
            <PageWrapper>
              <RegisterForm />
            </PageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <PageWrapper>
              <Contact />
            </PageWrapper>
          }
        />
        <Route
          path="/new-password/:userId/:token"
          element={
            <PageWrapper>
              <NewPassword />
            </PageWrapper>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PageWrapper>
              <ResetPassword />
            </PageWrapper>
          }
        />

        <Route
          path="/services"
          element={
            <PageWrapper>
              <Services />
            </PageWrapper>
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <PageWrapper>
                <Profile />
              </PageWrapper>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Nested Posts Routes */}
        <Route
          path="/posts"
          element={
            <PageWrapper>
              <PostsLayout />
            </PageWrapper>
          }
        >
          <Route index element={<Posts />} />
          <Route path="create" element={<CreatePost />} />
          <Route path=":id" element={<PostDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route
            path="/posts/categories/:catname"
            element={<SelectedCatPosts />}
          />
        </Route>

        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<Users />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="comments" element={<Comments />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFound />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
