// Posts.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Pagination,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Axios } from "../../utils/Axios";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const MotionBox = motion(Box);

export const Posts = () => {
  const [postsLoading, setPostsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetch = async () => {
      setPostsLoading(true);
      try {
        const res = await Axios.get(`/api/posts?page=${page}&limit=3`);
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setPostsLoading(false);
      }
    };
    fetch();
  }, [page]);

  const slides = useMemo(
    () => posts.map((p) => ({ src: p.image?.url, alt: p.title })),
    [posts]
  );

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Posts
      </Typography>

      {postsLoading ? (
        <Typography>Loading...</Typography>
      ) : posts.length === 0 ? (
        <Typography>No posts found.</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={4}>
          {posts.map((post, idx) => (
            <MotionBox
              key={post._id}
              component={Card}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              sx={{ width: "100%" }}
            >
              <CardMedia
                component="img"
                image={post.image?.url}
                alt={post.title}
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
                sx={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar
                    src={post.user?.profileImage?.url}
                    alt={post.user?.username}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {post.user?.username}
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  component="h2"
                  fontWeight="bold"
                  gutterBottom
                >
                  {post.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {showMore[post._id]
                    ? post.description
                    : post.description.length > 100
                    ? `${post.description.slice(0, 100)}…`
                    : post.description}
                </Typography>

                {post.description.length > 100 && (
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: "pointer", fontWeight: 500 }}
                    onClick={() =>
                      setShowMore((prev) => ({
                        ...prev,
                        [post._id]: !prev[post._id],
                      }))
                    }
                  >
                    {showMore[post._id] ? "Show Less" : "Show More"}
                  </Typography>
                )}

                <Box mt={2}>
                  <Button
                    component={Link}
                    to={`/posts/${post._id}`}
                    variant="contained"
                    size="small"
                  >
                    Read More
                  </Button>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={2}
                >
                  {post.createdAtHuman}
                </Typography>
              </CardContent>
            </MotionBox>
          ))}
        </Box>
      )}

      {totalPages > 1 && (
        <Box mt={6} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIndex}
        />
      )}
    </Container>
  );
};
