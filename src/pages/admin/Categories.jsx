import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { Axios } from "../../utils/Axios";
import Spinner from "./components/Spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const AdminCategories = () => {
  const { user } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingEditCat, setLoadingEditCat] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const fetchingCategories = async () => {
    const res = await Axios.get(`/api/categories`);
    setCategories(res.data.categories);
    setLoadingCats(false);
  };

  useEffect(() => {
    fetchingCategories();
  }, []);

  const handleDelete = (categoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted permanently!",
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
          const { data } = await Axios.delete(`/api/categories/${categoryId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          return data;
        } catch (err) {
          Swal.showValidationMessage(
            err?.response?.data?.message || "Failed to delete category"
          );
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value?.success) {
        toast.success(result.value.message || "Category deleted successfully");
        setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      }
    });
  };

  const openEditModal = (category) => {
    setEditCategory(category);
    setEditTitle(category.title);
    setEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editCategory) return;

    setLoadingEditCat(true);

    try {
      const res = await Axios.put(
        `/api/categories/${editCategory._id}`,
        {
          title: editTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === editCategory._id ? { ...cat, title: editTitle } : cat
        )
      );

      toast.success("Category updated successfully!");
      setEditModalOpen(false);
      setEditCategory(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update category";
      toast.error(msg);
    } finally {
      setLoadingEditCat(false);
    }
  };

  const createCategory = async () => {
    if (!newTitle.trim()) return;

    setCreateLoading(true);

    try {
      const { data } = await Axios.post(
        "/api/categories",
        { title: newTitle },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (data?.success) {
        setCategories((prev) => [
          ...prev,
          { ...data.category, user: { email: user.email } },
        ]);
        toast.success("Category created successfully");
        setCreateModalOpen(false);
        setNewTitle("");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create category";
      toast.error(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Categories</h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>
      {loadingCats ? (
        <div className="flex justify-center items-center h-64">
          <span className=" animate-pulse">Loading..</span>
        </div>
      ) : (
        <div className="overflow-auto rounded-lg shadow border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left font-semibold text-gray-600">
              <tr>
                <th className="p-3">Title</th>

                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 max-w-[300px] truncate">{cat.title}</td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      <Pencil className="w-4 h-4 inline" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-sm px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4 inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={loadingEditCat}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 ${
                  loadingEditCat ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loadingEditCat ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create Category</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Category title"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={createCategory}
                disabled={createLoading}
                className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2 ${
                  createLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {createLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
