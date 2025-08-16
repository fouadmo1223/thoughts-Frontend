import {
  setLoading,
  setProfile,
  setProfileError,
} from "../Slices/ProfileSlice";
import { Axios } from "../../utils/Axios";
import { toast } from "react-toastify";
import { login } from "../Slices/authSlice";

export function GetUserProfile(userId) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await Axios.get(`/api/users/profile/${userId}`);
      dispatch(setProfile(res.data.user));
    } catch (err) {
      console.error("Profile error:", err);
      toast.error(err?.response?.data?.message || "Failed to load profile.");
      dispatch(setProfileError(err.message));
    }
  };
}

export function UpdateUserInfo(data) {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const { token, _id } = getState().auth.user;
      const res = await Axios.put(`/api/users/profile/${_id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setProfile(res.data.user));
      toast.success("Profile info updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update info");
      dispatch(setProfileError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function UpdateProfileImage(file) {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const { token } = getState().auth.user;

      const formData = new FormData();
      formData.append("image", file); // ✅ "image" must match multer.single("image")

      const res = await Axios.post("/api/users/profile/image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Optional: Merge updated image into user object if needed
      const updatedImage = res.data.profileImage;
      const updatedUser = {
        ...getState().profile.profile,
        profileImage: { url: updatedImage },
      };

      dispatch(setProfile(updatedUser));
      dispatch(
        login({ ...getState().auth.user, profileImage: { url: updatedImage } })
      );
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile image updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update image");
      dispatch(setProfileError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
}
