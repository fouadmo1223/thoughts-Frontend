import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import ProfileSlice from "./Slices/ProfileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: ProfileSlice,
  },
});

export default store;
