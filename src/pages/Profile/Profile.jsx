import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../componnents/Spinner";
import { EditProfileModal } from "./EditProfileModal";
import { EditProfileImageModal } from "./EditProfileImageModal";
import { CreatePostModal } from "./CreatePostModal";
import { PostItem } from "./PostItem";
import {
  GetUserProfile,
  UpdateProfileImage,
  UpdateUserInfo,
} from "../../redux/apiCalls/profileApiCall";
import { Axios } from "../../utils/Axios";
import { toast, ToastContainer } from "react-toastify";
import { Plus } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { addPost } from "../../redux/Slices/ProfileSlice";

export function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, loading } = useSelector((state) => state.profile);

  // Modal states
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(GetUserProfile(user._id));
    }
  }, [user?._id]);

  const handleUpdateInfo = (updatedFields) => {
    dispatch(UpdateUserInfo({ ...updatedFields })).then(() => {
      dispatch(GetUserProfile(user._id));
    });
  };

  const handleUpdateImage = (imageData) => {
    dispatch(UpdateProfileImage(imageData)).then(() => {
      window.location.reload();
    });
  };

  // ✅ Direct Axios for creating new post
  const handleCreatePost = async (formData) => {
    try {
      const res = await Axios.post("/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(res.data);
      dispatch(addPost(res.data.post));
      toast.success("Post created successfully");
      return { success: true };
    } catch (err) {
      console.log(err.response);
      const fieldErrors = {};
      const errors = err?.response?.data?.errors;

      if (errors && typeof errors === "object") {
        Object.keys(errors).forEach((key) => {
          fieldErrors[key] = errors[key];
        });
      } else {
        fieldErrors.general =
          err?.response?.data?.message || "Something went wrong";
      }

      toast.error("Failed to create post");
      return { success: false, fieldErrors };
    }
  };

  const handleUpdatePost = (updatedPost) => {
    console.log("Edit Post ID:", updatedPost._id);
  };

  const handleDeletePost = (id) => {
    console.log("Delete Post ID:", id);
  };

  if (loading || !profile) return <Spinner />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={profile.profileImage?.url || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <button
            onClick={() => setShowImageModal(true)}
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full border shadow"
            title="Change Image"
          >
            ✏️
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{profile.username}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <p className="text-sm mt-1">{profile.bio}</p>
        </div>
        <button
          onClick={() => setShowEditInfoModal(true)}
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Edit Info
        </button>
      </div>

      {/* Create Post Box (Facebook style) */}
      <div
        onClick={() => setShowCreatePostModal(true)}
        className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl shadow hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        <img
          src={profile.profileImage?.url || "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
        <div className="flex-1 bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-full text-gray-600 text-sm text-left">
          What's on your mind, {profile.username.split(" ")[0]}?
        </div>
        <div className="hidden sm:flex items-center gap-1 text-blue-600 font-medium text-sm">
          <Plus size={18} />
          <span className="hidden md:inline">Post</span>
        </div>
      </div>
      {/* Create Post Button */}

      {/* Modals */}
      <EditProfileModal
        show={showEditInfoModal}
        onClose={() => setShowEditInfoModal(false)}
        user={profile}
        onUpdate={handleUpdateInfo}
      />

      <EditProfileImageModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        user={profile}
        onUpdate={handleUpdateImage}
      />

      <CreatePostModal
        show={showCreatePostModal} // ✅ instead of 'show'
        onClose={() => setShowCreatePostModal(false)}
        onCreate={handleCreatePost}
      />

      {/* Posts Section */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Posts</h3>
      <div className="space-y-6">
        {profile.posts?.length > 0 ? (
          profile.posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              currentUser={profile}
              onUpdatePost={handleUpdatePost}
              onDeletePost={handleDeletePost}
            />
          ))
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
