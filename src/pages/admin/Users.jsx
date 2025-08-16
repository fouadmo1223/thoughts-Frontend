import { useEffect, useState } from "react";
import { BadgeCheck, Ban, Trash2, Shield } from "lucide-react";
import { Unlock, CheckCircle } from "lucide-react";
import { Axios } from "../../utils/Axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// Sample fetch function (replace with your real API call)

const PER_PAGE = 6;

const Users = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const fetchUsers = async () => {
    const res = await Axios.get(`/api/users?page=${page}&limit=${PER_PAGE}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setUsers(res.data.users);
    setTotalPages(res.data.totalPages); // Set pagination from backend
    setLoading(false);

    console.log(res);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      allowOutsideClick: () => !Swal.isLoading(),
      allowEscapeKey: () => !Swal.isLoading(),
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const { data } = await Axios.delete(`/api/users/profile/${id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          return data;
        } catch (err) {
          Swal.showValidationMessage(
            err?.response?.data?.message || "Failed to delete user"
          );
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value?.success) {
        toast.success(result.value.message || "User deleted");
        navigate(0); // reload page after deletion
      }
    });
  };

  const handleBlock = (userId, isBlocked) => {
    Swal.fire({
      title: isBlocked ? "Unblock this user?" : "Block this user?",
      text: isBlocked
        ? "They will regain access to the app."
        : "They will be restricted from using the app.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#4caf50" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: isBlocked ? "Yes, unblock!" : "Yes, block!",
      allowOutsideClick: () => !Swal.isLoading(),
      allowEscapeKey: () => !Swal.isLoading(),
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const { data } = await Axios.put(`/api/users/block/${userId}`, null, {
            headers: {
              Authorization: `Bearer ${user.token}`, // replace with your actual token
            },
          });
          return data;
        } catch (err) {
          Swal.showValidationMessage(
            err?.response?.data?.message || "Failed to update user block status"
          );
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value?.success) {
        toast.success(result.value.message);
        // Update local state if needed
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u
          )
        );
      }
    });
  };

  const handleVerify = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be marked as verified.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, verify!",
      allowOutsideClick: () => !Swal.isLoading(),
      allowEscapeKey: () => !Swal.isLoading(),
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const { data } = await Axios.put(
            `/api/users/verify/${userId}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${user.token}`, // replace with your actual token
              },
            }
          );
          return data;
        } catch (err) {
          Swal.showValidationMessage(
            err?.response?.data?.message || "Failed to verify user"
          );
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value?.success) {
        toast.success(result.value.message || "User verified successfully");
        setTimeout(() => {
          navigate(0);
        }, 500);
        // Optionally update UI state (e.g., setUsers or refetch)
      }
    });
  };

  const handlePageClick = (p) => {
    setPage(p);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <div className="overflow-auto rounded-lg shadow border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left font-semibold text-gray-600">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3 hidden lg:table-cell">Email</th>
              <th className="p-3">Admin</th>
              <th className="p-3">Blocked</th>
              <th className="p-3">Verified</th>

              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !loading ? (
              <div className="w-full text-center py-10 text-gray-500">
                <p className="text-lg font-medium">No users found.</p>
                <p className="text-sm mt-1">
                  Try adjusting filters or check back later.
                </p>
              </div>
            ) : null}
            {users?.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={user.profileImage?.url}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{user.username}</span>
                </td>
                <td className="p-3 hidden  lg:table-cell">{user.email}</td>
                <td className="p-3">
                  {user.isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded">
                      <Shield className="w-4 h-4" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-700 bg-gray-100 rounded">
                      User
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {user.isBlocked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-red-700 bg-red-100 rounded">
                      <Ban className="w-4 h-4" /> Blocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded">
                      Active
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {user.isAccountVerfied ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded">
                      <BadgeCheck className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
                      Not Verified
                    </span>
                  )}
                </td>

                <td className="p-3 space-x-1 flex">
                  {!user.isAdmin && (
                    <>
                      <button
                        onClick={() => handleBlock(user._id, user.isBlocked)}
                        className="text-sm w-full px-2 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 flex items-center gap-2"
                      >
                        {user.isBlocked ? (
                          <>
                            <Unlock className="w-4 h-4" /> Unblock
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4" /> Block
                          </>
                        )}
                      </button>

                      {!user.isAccountVerfied && (
                        <button
                          onClick={() => handleVerify(user._id)}
                          className="text-sm w-full px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Verify
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-sm w-full px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageClick(p)}
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
    </div>
  );
};

export default Users;
