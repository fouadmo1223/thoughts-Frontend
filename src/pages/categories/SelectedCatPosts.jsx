import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Axios } from "../../utils/Axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const SelectedCatPosts = () => {
  const { catname } = useParams();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(catname || "");
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (catname) {
      setSelectedCategory(catname);
    }
  }, [catname]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios.get("/api/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await Axios.get(`/api/posts?category=${selectedCategory}`);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory) fetchPosts();
  }, [selectedCategory]);

  const handleCategoryClick = (title) => {
    setSelectedCategory(title);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="flex min-h-screen transition-all duration-300">
      {/* Sidebar */}
      <div
        className={`bg-gray-50 border-r border-gray-200 p-1 md:p-4 transition-all duration-300 overflow-auto ${
          isSidebarOpen ? "w-[20%]" : "w-0"
        } `}
      >
        <div
          className={`${
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-opacity duration-300`}
        >
          <h2 className=" text-normal md:text-xl font-bold mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat._id}>
                <button
                  onClick={() => handleCategoryClick(cat.title)}
                  className={`block w-full text-left text-sm md:text-base md:px-4 md:py-2 rounded hover:bg-blue-100 transition ${
                    cat.title === selectedCategory
                      ? "bg-blue-200 font-semibold"
                      : ""
                  }`}
                >
                  {cat.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`p-4 transition-all duration-300 ${
          isSidebarOpen ? "w-full md:w-[80%]" : "w-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg md:text-2xl font-bold">
            Posts in "{selectedCategory}"
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-4 py-2 text-md md:text-lg bg-blue-600 text-white rounded hover:bg-blue-700 transition  line-clamp-1"
          >
            {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          </button>
        </div>

        {/* Posts */}
        {loading ? (
          <p className="text-gray-500">Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row"
              >
                {/* Clickable image */}
                <img
                  src={post.image?.url}
                  alt={post.title}
                  onClick={() => openLightbox(index)}
                  className="w-full md:w-64 object-cover cursor-pointer h-48 md:h-auto"
                />

                {/* Content */}
                <div className="flex flex-col justify-between p-4 flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {post.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {post.createdAtHuman}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {post.description}
                  </p>

                  <span className="inline-block text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded mb-4 w-fit">
                    {post.category}
                  </span>

                  {/* Bottom row always visible */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <img
                        src={
                          post.user?.profileImage?.url || "/default-avatar.png"
                        }
                        alt={post.user?.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{post.user?.username}</span>
                    </div>

                    <button
                      className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      onClick={() => navigate(`/posts/${post._id}`)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts found in this category.</p>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={posts.map((post) => ({
          src: post.image?.url,
          alt: post.title,
        }))}
        plugins={[Zoom]}
      />
    </div>
  );
};

export default SelectedCatPosts;
