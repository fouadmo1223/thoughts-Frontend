// CommentItem.jsx
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical } from "lucide-react";

export const CommentItem = ({ comment }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="border rounded-md p-4 bg-white relative shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <img
            src={comment.user?.profileImage?.url}
            alt={comment.user?.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{comment.user?.username}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 bg-white border rounded shadow-md z-10">
              <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                Edit
              </button>
              <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-500">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700">{comment.text}</p>
    </div>
  );
};
