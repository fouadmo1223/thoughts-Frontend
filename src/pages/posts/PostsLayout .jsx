// pages/posts/PostsLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const PostsLayout = () => {
  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default PostsLayout;
