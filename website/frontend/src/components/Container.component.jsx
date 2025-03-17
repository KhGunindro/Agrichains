import React from "react";
import { motion } from "framer-motion";
import { FaCube, FaEnvelope, FaUserAlt, FaBalanceScale } from "react-icons/fa";

const Container = ({ darkMode }) => {
  return (
    <div className={`my-12 w-full flex justify-center p-12 rounded-lg`}>
      <div className="w-[90%] max-md:w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Steps */}
        {[
          {
            title: "100% transparency",
            desc: "Full Visibility Into Every Process and Transaction.",
            icon: <FaCube className="text-3xl" />,
          },
          {
            title: "2-way SMS feature",
            desc: "Personalized two-way messaging for better customer engagement.",
            icon: <FaEnvelope className="text-3xl" />,
          },
          {
            title: "No intermediaries",
            desc: "Direct and seamless interactions—no third parties involved.",
            icon: <FaUserAlt className="text-3xl" />,
          },
          {
            title: "Improves local economy",
            desc: "Boosting local businesses and strengthening communities.",
            icon: <FaBalanceScale className="text-3xl" />,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-12 rounded-lg ${darkMode
                ? "bg-gradient-to-r from-gray-800 to-gray-700"
                : "bg-gradient-to-r from-blue-100 to-purple-100"
              } backdrop-blur-sm relative shadow-lg`}
          >
            {/* Icon (Top Right) */}
            <div className="absolute top-4 right-4">{item.icon}</div>

            {/* Title */}
            <h3
              className={`text-left text-xl font-bold mt-20 mb-2 ${darkMode ? "text-white" : "text-gray-800"
                }`}
            >
              {item.title}
            </h3>

            {/* Description */}
            <p
              className={`text-left text-lg ${darkMode ? "text-white/90" : "text-gray-700"
                }`}
            >
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Container;