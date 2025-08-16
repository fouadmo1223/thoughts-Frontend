import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical } from "lucide-react";
import axios from "axios";
import EditPostModal from "./EditPostModal";
import { useSelector } from "react-redux";
import { Axios } from "../../utils/Axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
export const PostItem = ({ post, onUpdatePost, onDeletePost, currentUser }) => {
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });
  const currentUserId = post.user._id;

  const handleEdit = () => {
    setShowMenu(false);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This post will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      allowOutsideClick: () => !Swal.isLoading(),
      allowEscapeKey: () => !Swal.isLoading(),
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const { data } = await Axios.delete(`/api/posts/${post._id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          toast.success(data.message || "Post deleted successfully");
          return true;
        } catch (err) {
          toast.error(err?.response?.data?.message || "Failed to delete post");
          throw new Error("Delete failed");
        }
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          navigate(0); // ✅ refresh the page
        }
      })
      .catch(() => {
        // ✅ suppress unhandled promise rejection error
      });
  };

  const handleSave = async (updatedPost) => {
    try {
      const formData = new FormData();
      formData.append("title", updatedPost.title);
      formData.append("description", updatedPost.description);
      if (updatedPost.image instanceof File) {
        formData.append("image", updatedPost.image);
      }

      const res = await Axios.put(`/api/posts/${post._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      onUpdatePost(res.data.post);
      setShowEditModal(false);
      setSnackbar({
        show: true,
        message: "Post updated successfully",
        type: "success",
      });

      setTimeout(() => {
        navigate(0);
        setSnackbar({ show: false, message: "", type: "" });
      }, 3000);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm relative">
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}

      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <img
            src={
              currentUser?.profileImage?.url ||
              "https://via.placeholder.com/40x40?text=User"
            }
            alt="user"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <h4 className="font-medium">
              {currentUser?.username || "Unknown"}
            </h4>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </span>
          </div>
        </div>

        {currentUser?._id === currentUserId && (
          <div className="relative">
            <button onClick={() => setShowMenu((prev) => !prev)}>
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-sm z-10">
                <button
                  onClick={handleEdit}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      <p className="text-sm text-gray-700 mb-3">{post.description}</p>

      {post.image?.url && (
        <img
          src={post.image.url}
          alt={post.title}
          className="w-full h-64 object-cover rounded cursor-pointer"
          onClick={() => navigate(`/posts/${post._id}`)}
        />
      )}

      <div className="flex gap-4 text-sm text-gray-600 mb-2">
        <span>{post.likes?.length || 0} Likes</span>
        <span>{post.comments?.length || 0} Comments</span>
      </div>

      <div className="space-y-2">
        {(showAllComments
          ? post.comments
          : post.comments?.slice(0, 2) || []
        ).map((comment) => (
          <div key={comment._id} className="bg-gray-100 p-2 rounded">
            <div className="flex gap-2 items-start">
              <img
                src={
                  comment.user?.profileImage?.url ||
                  "https://via.placeholder.com/32x32?text=User"
                }
                className="w-8 h-8 rounded-full object-cover"
                alt="commenter"
              />
              <div>
                <p className="text-sm font-medium">
                  {comment.user?.username || "Anonymous"}
                </p>
                <p className="text-sm text-gray-700">{comment.text}</p>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </span>
              </div>
            </div>
          </div>
        ))}

        {post.comments?.length > 2 && !showAllComments && (
          <button
            onClick={() => setShowAllComments(true)}
            className="text-blue-600 text-sm hover:underline mt-1"
          >
            Show more comments
          </button>
        )}
      </div>

      {/* Global snackbar (success only) */}
      {snackbar.show && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow text-white z-50 ${
            snackbar.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
};
