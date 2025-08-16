import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const boxVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const StatsBox = ({ name, number, link, icon, index }) => {
  return (
    <motion.div
      custom={index}
      variants={boxVariants}
      initial="hidden"
      animate="visible"
      className="w-full sm:w-1/2 lg:w-1/4 p-2"
    >
      <Link
        to={link}
        className="block bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition group"
      >
        <div className="flex items-center justify-between">
          <div className="text-gray-600 group-hover:text-black">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-2xl font-semibold mt-1">{number}</p>
          </div>
          <div className="text-gray-400 group-hover:text-black text-3xl">
            {icon}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default StatsBox;
