import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import BuildIcon from "@mui/icons-material/Build";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { useTheme } from "@mui/material/styles";
import LoginDrawer from "./LoginDrawer";
import HeaderLinks from "./HeaderLinks";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/Slices/authSlice";
import { LogOutUser } from "../redux/apiCalls/authApiCalls";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const isLoggedIn = user ? true : false; // set to true to test logged in state

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navLinks = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Posts", icon: <ArticleIcon />, path: "/posts" },
    { label: "Services", icon: <BuildIcon />, path: "/services" },
    { label: "Contact", icon: <ContactMailIcon />, path: "/contact" },
  ];

  if (user?.isAdmin) {
    navLinks.push({
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    });
  }

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgba(255,255,255,0.9)",
        color: "#1d2d3d",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Thoughts
        </Typography>

        <HeaderLinks isMobile={isMobile} navLinks={navLinks} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!isLoggedIn ? (
            <>
              <Button
                color="inherit"
                startIcon={<LoginIcon />}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Avatar
                src={
                  user?.profileImage?.url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.username || "User"
                  )}&background=random`
                }
                alt={user?.username || "User"}
                onClick={handleMenuOpen}
                sx={{ cursor: "pointer" }}
              />
              <Typography>{profile?.username || user?.username}</Typography>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(LogOutUser());
                    handleMenuClose();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}

          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      <LoginDrawer
        isLoggedIn={isLoggedIn}
        navLinks={navLinks}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </AppBar>
  );
};

export default Header;
