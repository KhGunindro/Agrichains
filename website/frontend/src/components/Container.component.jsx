import React from "react";
import { motion } from "framer-motion";

const Container = ({ image, text, position, darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }} // Start below and invisible
      whileInView={{ opacity: 1, y: 0 }} // Transition to visible and centered
      transition={{ duration: 1, ease: "easeOut" }} // Slow pop-up animation
      viewport={{ once: true }} // Animate only once
      className={`my-12 w-full flex justify-center`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }} // Smooth hover scale animation
        transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
        className={`w-[60%] max-md:w-full max-md:px-4 p-8 rounded-lg ${
          darkMode ? "bg-gray-900/30" : "bg-white/30"
        } backdrop-blur-sm`}
      >
        <img
          src={`${image}`}
          alt="Step"
          className="w-full h-72 md:h-[30rem] object-cover rounded-lg mb-6"
        />
        <p
          className={`text-lg ${
            darkMode ? "text-gray-100/90" : "text-gray-800/90"
          } `}
        >
          {text}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Container;
