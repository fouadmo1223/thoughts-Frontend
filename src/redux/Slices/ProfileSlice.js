import { createSlice } from "@reduxjs/toolkit";

const ProfileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    },
    addPost: (state, action) => {
      state.profile.posts.unshift(action.payload);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProfileError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setProfile, setLoading, setProfileError, addPost } =
  ProfileSlice.actions;
export default ProfileSlice.reducer;
