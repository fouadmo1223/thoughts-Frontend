import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex ">
      <AdminSidebar
        isOpen={isSidebarOpen || isDesktop}
        onToggle={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 p-4 overflow-auto bg-gray-50 relative">
        {/* Show toggle button only on mobile when sidebar is closed */}
        {!isSidebarOpen && !isDesktop && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-40 p-2 rounded-md bg-gray-200 hover:bg-gray-300 md:hidden"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
