import React from "react";
import { motion } from "framer-motion";

const Container = ({ image, text, position, darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: position === "left" ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`my-8 w-full flex ${
        position === "left" ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`w-[65%] p-6 border-2 ${
          darkMode ? "border-gray-700" : "border-gray-300"
        } rounded-lg shadow-lg transition-transform duration-300 hover:scale-105`} // Added hover effect
      >
        <img
          src={`/src/assets/${image}`}
          alt="Step"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-lg">{text}</p>
      </div>
    </motion.div>
  );
};

export default Container;
