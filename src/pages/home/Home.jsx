import React, { use, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Link, useNavigate } from "react-router-dom";
import { Axios } from "../../utils/Axios";

const MotionBox = motion(Box);

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};
const sectionStyle = { py: 10, px: 2, textAlign: "center" };

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { delayChildren: 0.2, staggerChildren: 0.2 },
  },
  viewport: { once: true },
};

const Home = () => {
  const [catLoading, setCatLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await Axios.get("/api/categories");
      setCategories(res.data.categories);
      setCatLoading(false);
      console.log(res.data);
    };
    const fetchPosts = async () => {
      const res = await Axios.get("/api/posts?limit=3");
      setPosts(res.data.posts);
      setPostsLoading(false);
      console.log(res.data.posts);
    };
    fetchCategories();
    fetchPosts();
  }, []);

  return (
    <Box sx={{ fontFamily: "'Inter', sans-serif" }}>
      {/* 1. Hero Section */}
      <MotionBox
        sx={{
          ...sectionStyle,
          minHeight: "100vh",
          bgcolor: "#1a1a1a",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
        {...fadeUp}
      >
        <Container>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Escape into the World of Thoughts 📚
          </Typography>
          <Typography variant="h6" color="gray">
            Discover, read, and fall in love with thousands of stories.
          </Typography>
          <Button
            onClick={() => navigate("/posts")}
            variant="contained"
            size="large"
            sx={{ mt: 4 }}
          >
            Start Discovring
          </Button>
        </Container>
      </MotionBox>

      {/* 2. Categories as Cards */}
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom>
          Categories
        </Typography>
        <Grid container spacing={4}>
          {catLoading && <Typography>Loading...</Typography>}
          {categories.length === 0 && !catLoading && (
            <Typography className="text-center !text-[14px] font-light ">
              No categories found.
            </Typography>
          )}
          {categories.map((cat, i) => (
            <Grid item xs={12} sm={6} md={4} key={cat._id}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
              >
                <Link
                  to={`/posts/categories/${encodeURIComponent(cat.title)}`}
                  className="block group transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="h-16 p-4  bg-white rounded-xl shadow-md flex items-center justify-center text-center border border-gray-200 hover:bg-blue-50 hover:shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {cat.title}
                    </h2>
                  </div>
                </Link>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ py: 5 }}>
        <div className="py-10 px-4 md:px-8">
          <h2 className="text-3xl font-semibold mb-6">Latest Posts</h2>

          {postsLoading && <p className="text-gray-500 mb-4">Loading...</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <MotionBox
                key={post._id}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="bg-white cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                  onClick={() => {
                    navigate(`/posts/${post?._id}`);
                  }}
                >
                  <img
                    src={post.image.url}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="flex flex-col justify-between flex-1 px-4 py-3">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold truncate mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {post.description}
                      </p>
                    </div>

                    <div className="flex items-center mt-3">
                      <img
                        src={post.user.profileImage.url}
                        alt={post.user.username}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {post.user.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 text-sm">
                      <p className="text-gray-500">
                        ❤️ {post.likes.length} like
                        {post.likes.length !== 1 ? "s" : ""}
                      </p>
                      <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs">
                        #{post.category}
                      </span>
                    </div>
                  </div>
                </div>
              </MotionBox>
            ))}
          </div>
        </div>
      </Container>

      {/* 5. Website Features Section */}
      <Box sx={{ py: 10, bgcolor: "white" }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Use <span className="text-blue-600">Thoughts</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Share your ideas, discover what others are thinking, and connect
              with people who inspire you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💭",
                title: "Post Freely",
                desc: "Express your thoughts anytime, anywhere. No limits, just your ideas.",
              },
              {
                icon: "🌍",
                title: "Discover",
                desc: "See what people worldwide are thinking and join the conversation.",
              },
              {
                icon: "🤝",
                title: "Connect",
                desc: "Engage with a community that values opinions, creativity, and inspiration.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 text-center border border-gray-100 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Box>

      {/* 6. Community Highlights Section */}
      <Box sx={{ py: 12, bgcolor: "#f9fafb" }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🌟 Community Highlights
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what’s trending in Thoughts — real voices, real opinions, real
              people.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "“I shared my first thought here, and the feedback was amazing! It feels like a safe space.”",
                user: "Sarah M.",
                role: "Student",
                img: "https://source.unsplash.com/80x80/?woman,face",
              },
              {
                text: "“Thoughts is where I discover ideas that challenge my perspective every day.”",
                user: "David L.",
                role: "Entrepreneur",
                img: "https://source.unsplash.com/80x80/?man,face",
              },
              {
                text: "“Finally, a platform that values real voices over noise. I’m hooked!”",
                user: "Aisha K.",
                role: "Writer",
                img: "https://source.unsplash.com/80x80/?person,portrait",
              },
            ].map((highlight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center border border-gray-100"
              >
                <p className="text-gray-700 italic mb-4"> {highlight.text} </p>
                <div className="flex items-center justify-center gap-3">
                  <Avatar
                    src={`https://source.unsplash.com/100x100/?face,portrait,${i}`}
                  />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">
                      {highlight.user}
                    </h4>
                    <p className="text-gray-500 text-sm">{highlight.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Box>

      {/* 7. How It Works Section */}
      <Box sx={{ py: 14, bgcolor: "#111827", color: "white" }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🚀 How Does <span className="text-blue-400">Thoughts</span> Work?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Getting started is easy — share what’s on your mind and join the
              conversation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Create an Account",
                desc: "Sign up in seconds and set up your profile.",
                icon: "👤",
              },
              {
                step: "02",
                title: "Share Your Thoughts",
                desc: "Post what’s on your mind — short or long, it’s up to you.",
                icon: "✍️",
              },
              {
                step: "03",
                title: "Connect & Engage",
                desc: "Like, comment, and connect with others in the community.",
                icon: "💬",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative bg-gray-900 rounded-2xl shadow-xl p-8 text-center hover:bg-gray-800 transition-all"
              >
                {/* Step Number */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold shadow-lg">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4">{item.icon}</div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
