import { Box, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const HeaderLinks = ({ isMobile, navLinks }) => {
  const location = useLocation();

  if (isMobile) return null;

  return (
    <Box sx={{ display: "flex", gap: 3 }}>
      {navLinks.map(({ label, icon, path }) => {
      const isActive =
      path === "/"
        ? location.pathname === "/" // exact match for Home
        : location.pathname.startsWith(path);

        return (
          <Button
            key={label}
            component={Link}
            to={path}
            startIcon={icon}
            sx={{
              position: "relative",
              color: isActive ? "#0275d8" : "#1d2d3d",
              fontWeight: isActive ? "bold" : "500",
              textTransform: "none",
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: -2,
                height: "2px",
                width: isActive ? "100%" : "0%",
                backgroundColor: "#0275d8",
                transition: "width 0.3s ease",
              },
              "&:hover::after": {
                width: "100%",
              },
            }}
          >
            {label}
          </Button>
        );
      })}
    </Box>
  );
};

export default HeaderLinks;
