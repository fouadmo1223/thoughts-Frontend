import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { LogOutUser } from "../redux/apiCalls/authApiCalls";

const LoginDrawer = ({ isLoggedIn, navLinks, drawerOpen, setDrawerOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <List sx={{ width: 240 }}>
        {navLinks.map(({ label, icon, path }) => (
          <ListItem
            button
            key={label}
            component={Link}
            to={path}
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />

        {!isLoggedIn ? (
          <>
            <ListItem
              button
              key={"Login"}
              component={Link}
              to={"/login"}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              button
              key={"SignUp"}
              component={Link}
              to={"/register"}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              button
              key={"profile"}
              component={Link}
              to={"/profile"}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                dispatch(LogOutUser());
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default LoginDrawer;
