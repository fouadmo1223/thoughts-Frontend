import React, { useEffect, useState } from "react";
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

import { Link } from "react-router-dom";
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
            Escape into the World of Books 📚
          </Typography>
          <Typography variant="h6" color="gray">
            Discover, read, and fall in love with thousands of stories.
          </Typography>
          <Button variant="contained" size="large" sx={{ mt: 4 }}>
            Start Reading
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
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
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

      {/* 4. Testimonials Swiper */}
      <Box sx={{ py: 10, backgroundColor: "#1e1e1e", color: "white" }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom textAlign="center">
            ❤️ What Our Readers Say
          </Typography>
          <Swiper
            modules={[Autoplay, Navigation]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            navigation
            loop
            spaceBetween={40}
            slidesPerView={1}
            style={{ paddingTop: "30px" }}
          >
            {[1, 2, 3].map((i) => (
              <SwiperSlide key={i}>
                <Box textAlign="center" px={4}>
                  <Typography fontSize={20} mb={3}>
                    “BookVerse has completely changed how I find books. I love
                    the clean layout and curated picks!”
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                  >
                    <Avatar
                      src={`https://source.unsplash.com/100x100/?face,portrait,${i}`}
                    />
                    <Box>
                      <Typography variant="subtitle1">Reader {i}</Typography>
                      <Typography variant="caption" color="gray">
                        Book Lover
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </Box>

      {/* 5. Newsletter */}
      <Box sx={{ py: 10, bgcolor: "#111", color: "#fff", textAlign: "center" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Stay in the Loop
          </Typography>
          <Typography color="gray" mb={3}>
            Get updates on new posts and trending topics.
          </Typography>
          <Box
            component="form"
            display="flex"
            gap={2}
            flexWrap="wrap"
            justifyContent="center"
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your email"
              sx={{ bgcolor: "#fff", borderRadius: 1 }}
            />
            <Button variant="contained" size="large">
              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
