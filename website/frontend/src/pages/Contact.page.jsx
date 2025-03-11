import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa"; // Import the arrow icon

const Contact = ({ darkMode }) => {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } p-4 sm:p-8`} // Adjusted padding for smaller screens
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row ${
          darkMode ? "bg-gray-800" : "bg-white"
        } mt-16 sm:mt-0`} // Added top margin for mobile view
      >
        {/* Left Side: GET IN TOUCH Message */}
        <div
          className={`w-full md:w-1/2 bg-green-700 text-white p-4 sm:p-12 flex flex-col justify-center`} // Adjusted padding for smaller screens
        >
          <h1 className="text-[1.3rem] sm:text-5xl font-bold mb-4 sm:mb-6">
            GET IN TOUCH
          </h1>{" "}
          {/* Adjusted font size for smaller screens */}
          <p className="text-[13px] sm:text-lg mb-4">
            Interested in working together? Fill out some info and we will be in
            touch shortly.
          </p>
          <p className="text-xs sm:text-lg">We can't wait to hear from you!</p>
        </div>

        {/* Right Side: Input Fields */}
        <div className="w-full text-[13px] md:w-1/2 p-4 sm:p-12">
          <form>
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="name"
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-600`}
                required
              />
            </div>
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-600`}
                required
              />
            </div>
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="message"
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-600`}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className={`w-full bg-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 hover:scale-105`}
            >
              Send Message
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
