import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { UpdateProfileImage } from "../../redux/apiCalls/profileApiCall";

export const EditProfileImageModal = ({ show, onClose, currentImage }) => {
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const [preview, setPreview] = useState(currentImage || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    await dispatch(UpdateProfileImage(selectedFile));
    setLoading(false);
    onClose(); // close modal on success
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Update Profile Image
        </h2>

        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4" />
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className={`px-4 py-2 text-white rounded ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading || !selectedFile}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};
