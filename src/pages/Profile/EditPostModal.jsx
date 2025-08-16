import { useState } from "react";

const EditPostModal = ({ post, onClose, onSave }) => {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(post.image?.url || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    try {
      const updatedPost = {
        ...post,
        title,
        description,
        image: imageFile || post.image,
      };

      await onSave(updatedPost); // Will throw error if failed
    } catch (err) {
      const errorData = err?.response?.data;
      setErrors(errorData?.errors || {});
      setSnackbar({
        show: true,
        message: errorData?.message || "An error occurred",
        type: "error",
      });

      setTimeout(
        () => setSnackbar({ show: false, message: "", type: "" }),
        3000
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Edit Post</h2>

        <input
          type="text"
          className="w-full border p-2 mb-1 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mb-2">{errors.title}</p>
        )}

        <textarea
          className="w-full border p-2 mb-1 rounded"
          placeholder="Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mb-2">{errors.description}</p>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Image</label>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover mb-2 rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-blue-400" : "bg-blue-600"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Local error snackbar inside modal */}
        {snackbar.show && (
          <div
            className={`absolute bottom-4 left-4 right-4 mx-auto px-4 py-2 rounded shadow text-sm text-white ${
              snackbar.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {snackbar.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPostModal;
