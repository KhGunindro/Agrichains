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
      } max-md:justify-center`} // Center only in mobile view (max-md:)
    >
      <div
        className={`w-[65%] max-md:w-screen p-4 border-2 ${
          darkMode ? "border-gray-700" : "border-gray-300"
        } rounded-lg shadow-lg transition-transform duration-300 hover:scale-105`} // Full width on mobile (max-md:w-full)
      >
        <img
          src={`https://cdn.pixabay.com/photo/2018/01/18/07/31/bitcoin-3089728_960_720.jpg`} //src={`${image}`}
          alt="Step"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-lg">{text}</p>
      </div>
    </motion.div>
  );
};

export default Container;
