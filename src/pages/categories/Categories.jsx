import { categories } from "../../dummyData";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

// Animation variant
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export const Categories = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <section className="px-4 md:px-8 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat._id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Link
              to={`/posts/categories/${encodeURIComponent(cat.title)}`}
              className="block bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-blue-500 transition-all duration-300"
            >
              <div className="h-32 flex items-center justify-center text-center px-4">
                <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                  {cat.title}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
