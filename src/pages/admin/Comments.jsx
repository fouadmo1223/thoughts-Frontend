import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Axios } from "../../utils/Axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
const PER_PAGE = 6;

const Comments = () => {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  const fetchComments = async () => {
    try {
      const res = await Axios.get(`/api/comments?page=${page}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // API returns: { comments: [...], totalComments, ... }
      setComments(res.data.comments || []);
      setTotalComments(res.data.totalComments || 0);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page]);

  const paginated = comments.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(comments.length / PER_PAGE);

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
          const { data } = await Axios.delete(`/api/comments/${id}`, {
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
        fetchComments();
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">All Comments</h2>
      <p className="mb-4 text-gray-600">
        Total comments: <span className="font-semibold">{totalComments}</span>
      </p>

      <div className="overflow-auto rounded-lg shadow border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left font-semibold text-gray-600">
            <tr>
              <th className="p-3">User Email</th>
              <th className="p-3">Comment</th>
              <th className="p-3">Post</th>
              <th className="p-3">Likes</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((comment) => (
              <tr key={comment._id} className="border-t hover:bg-gray-50">
                {/* Email instead of image */}
                <td className="p-3">{comment.user?.email}</td>

                <td className="p-3 max-w-[300px] truncate">
                  <span className="block">{comment.text}</span>
                </td>

                {/* Clickable post title */}
                <td className="p-3">
                  <Link
                    to={`/posts/${comment.post._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {comment.post.title}
                  </Link>
                </td>

                <td className="p-3">{comment.likes?.length || 0}</td>
                <td className="p-3 text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-sm px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4 inline" /> Delete
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No comments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded border ${
                page === p
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
