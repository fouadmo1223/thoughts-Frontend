import { NavLink, useNavigate } from "react-router-dom";
import { X, LayoutGrid, Users, MessageSquare, FileText } from "lucide-react";
import { use } from "react";

const navItems = [
  {
    to: "/dashboard/posts",
    label: "Posts",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    to: "/dashboard/categories",
    label: "Categories",
    icon: <LayoutGrid className="w-5 h-5" />,
  },
  {
    to: "/dashboard/users",
    label: "Users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    to: "/dashboard/comments",
    label: "Comments",
    icon: <MessageSquare className="w-5 h-5" />,
  },
];

const AdminSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-gray-800 text-white h-full z-50 transition-all duration-300 
        ${isOpen ? "w-64 p-4" : "w-0 p-0 overflow-hidden"} 
        fixed md:static top-0 left-0`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-xl font-semibold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Admin
        </h2>
        <button onClick={onToggle} className="md:hidden">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="space-y-3">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
