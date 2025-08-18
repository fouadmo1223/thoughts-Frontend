import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Axios } from "../../utils/Axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AdminPosts = () => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await Axios.get(`/api/posts?page=${page}`);
      setPosts(res.data.posts);
      setPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This post will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      allowEscapeKey: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          const { data } = await Axios.delete(`/api/posts/${id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          return data;
        } catch (err) {
          Swal.showValidationMessage(
            err?.response?.data?.message || "Failed to delete post"
          );
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value?.success) {
        toast.success(result.value.message || "Post deleted");
        fetchPosts();
      }
    });
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  if (loadingPosts) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className=" animate-pulse">Loading..</span>
      </div>
    );
  }

  if (!posts.length && !loadingPosts)
    return (
      <div className="text-center py-8 text-gray-500 text-lg">
        No posts found
      </div>
    );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">All Posts</h2>

      <div className="overflow-auto rounded shadow">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Likes</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-t">
                <td
                  className="px-4 py-2 text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate(`/posts/${post._id}`)}
                >
                  {post.title}
                </td>
                <td className="px-4 py-2 text-gray-700">{post.description}</td>
                <td className="px-4 py-2">
                  {post.image?.url && (
                    <img
                      src={post.image.url}
                      alt="post"
                      onClick={() => setLightboxImage(post.image.url)}
                      className="w-20 h-20 object-contain cursor-zoom-in"
                    />
                  )}
                </td>
                <td className="px-4 py-2">{post.likes?.length} ❤️</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {post.createdAtHuman}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-sm px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-2">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {lightboxImage && (
        <Lightbox
          open={true}
          close={() => setLightboxImage(null)}
          slides={[{ src: lightboxImage }]}
        />
      )}
    </div>
  );
};

export default AdminPosts;
