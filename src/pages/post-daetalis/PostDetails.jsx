import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaUserCircle,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { Axios } from "../../utils/Axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const PostDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loadingEditId, setLoadingEditId] = useState(null); // for per-comment loading spinner
  const [editedText, setEditedText] = useState("");
  const [hoveredLikes, setHoveredLikes] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [likesLoading, setLikesLoading] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await Axios.get(`/api/posts/${id}`);
      const post = res.data.post;
      setPost(post);
      setComments(post.comments || []);
      setLikes(post.likes || []);
      setLiked(post.likes.some((likeUser) => likeUser._id === user._id));
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("Please login to like a post");
      return;
    }
    if (likesLoading) return;

    // Optimistically update UI
    const alreadyLiked = likes.some((likeUser) => likeUser._id === user._id);
    const newLikes = alreadyLiked
      ? likes.filter((likeUser) => likeUser._id !== user._id)
      : [...likes, user];

    setLiked(!alreadyLiked);
    setLikes(newLikes);

    try {
      setLikesLoading(true);
      await Axios.put(
        `/api/posts/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Optional: revert UI if needed
      toast.error("Failed to toggle like");
      setLiked(alreadyLiked);
      setLikes(likes);
    } finally {
      setLikesLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);

    try {
      const { data } = await Axios.post(
        "/api/comments",
        {
          text: newComment,
          post: post._id, // Make sure postId is defined in scope
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success(data.message || "Comment added successfully");

      setComments((prev) => [...prev, data.comment]);
      setNewComment("");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to add comment";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This comment will be deleted permanently!",
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
          const { data } = await Axios.delete(`/api/comments/${commentId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          return data;
        } catch (err) {
          Swal.showValidationMessage(
            err?.response?.data?.message || "Failed to delete comment"
          );
          return false; // Prevent resolve
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value?.success) {
        toast.success(result.value.message || "Comment deleted successfully");
        // Update local state
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    });
  };

  const handleEditComment = (commentId, currentText) => {
    setEditingId(commentId);
    setEditedText(currentText);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editedText.trim()) return;

    setLoadingEditId(commentId);

    try {
      const { data } = await Axios.put(
        `/api/comments/${commentId}`,
        { text: editedText },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success(data.message || "Comment updated");

      // Replace updated comment in state
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? data.comment : c))
      );

      setEditingId(null);
      setEditedText("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update comment");
    } finally {
      setLoadingEditId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedText("");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPost();
  }, []);

  if (!post) return null;

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Post Image */}
      <div className="overflow-hidden rounded-xl shadow mb-6">
        <img
          src={post.image?.url}
          alt="Post"
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Title & Category */}
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <span className="mt-2 sm:mt-0 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
          {post.category}
        </span>
      </div>

      {/* Author Info */}
      <div className="text-sm text-gray-600 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={post.user?.profileImage?.url}
            className="rounded-full w-[30px] h-[30px]"
            alt={post.user?.username}
          />
          <span>
            <strong>{post.user?.username}</strong>
          </span>
        </div>
        <span>🕒 {moment(post.createdAt).fromNow()}</span>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-lg mb-6">{post.description}</p>

      {/* Likes */}
      <div className="inline-flex items-center gap-2 mb-10 relative">
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLikeToggle}
          className={`cursor-pointer ${
            likesLoading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {likesLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          ) : liked ? (
            <FaHeart className="text-red-500 text-2xl" />
          ) : (
            <FaRegHeart className="text-gray-500 text-2xl" />
          )}
        </motion.div>

        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setHoveredLikes(true)}
          onMouseLeave={() => setHoveredLikes(false)}
        >
          <span className="text-gray-600 text-sm">{likes.length} likes</span>
          {hoveredLikes && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute mt-2 bg-white border border-gray-200 rounded shadow-md p-2 text-xs text-gray-700 z-10 max-w-xs"
            >
              <ul className="space-y-1">
                {likes.map((u) => (
                  <li key={u._id}>{u.username}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {comments.length === 0 && <p>No comments yet. Be the first!</p>}
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm relative"
              >
                <FaUserCircle className="text-2xl text-gray-500 mt-1" />
                <div className="flex-1">
                  <p className="font-medium">{comment.user.username}</p>
                  {editingId === comment._id ? (
                    <div>
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full border mt-1 rounded-md p-2 text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleSaveEdit(comment._id)}
                          className="text-green-600 hover:underline flex items-center gap-1 text-sm"
                          disabled={loadingEditId === comment._id}
                        >
                          {loadingEditId === comment._id ? (
                            <span className="animate-spin w-4 h-4 border border-green-600 border-t-transparent rounded-full"></span>
                          ) : (
                            <>
                              <FaSave /> Save
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:underline flex items-center gap-1 text-sm"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">{comment.text}</p>
                  )}
                </div>

                {user?._id === comment.user._id &&
                  editingId !== comment._id && (
                    <div className="absolute top-2 right-2 flex gap-2 text-sm">
                      <button
                        onClick={() =>
                          handleEditComment(comment._id, comment.text)
                        }
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Comment Input */}
        <div className="mt-6">
          <textarea
            rows={3}
            className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {user ? (
            <button
              onClick={handleAddComment}
              className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add Comment
            </button>
          ) : (
            <p
              className=" mt-2 text-xl hover:text-red-500 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login To Comment
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
