import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaUsers, FaEnvelope } from "react-icons/fa"; // Add FaEnvelope
import { Sprout } from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for route detection

const Navbar = ({
  darkMode,
  toggleDarkMode,
  togglePopup,
  scrollToTop,
  visible,
}) => {
  const location = useLocation(); // Get the current route location

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100 }} // Start off-screen
          animate={{ y: 0 }} // Slide down into view
          exit={{ y: -100 }} // Slide up out of view
          transition={{ type: "spring", stiffness: 100, damping: 20 }} // Smooth spring animation
          className={`fixed top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center ${
            darkMode ? "bg-gray-800/100" : "bg-white/100"
          } drop-shadow-lg z-50`} // Adjusted padding for mobile view
        >
          <div className="flex items-center group">
            <Sprout className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 transition-transform duration-300 group-hover:rotate-12" />{" "}
            {/* Adjusted icon size for mobile */}
            <Link
              to="/" // Navigate to the homepage
              onClick={scrollToTop} // Scroll to the top of the page
              className={`text-lg sm:text-xl md:text-2xl font-bold bg-clip-text ml-2 ${
                darkMode ? "text-white" : "text-black"
              } cursor-pointer`} // Adjusted font size for mobile
            >
              AgriChains
            </Link>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Show mail and group icons only on the homepage */}
            {location.pathname === "/" && (
              <>
                {/* Mail Icon */}
                <Link
                  to="/contact" // Navigate to the contact page
                  className={`p-1 sm:p-2 rounded-full ${
                    darkMode
                      ? "hover:bg-white hover:text-black"
                      : "hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <FaEnvelope className="text-lg sm:text-xl" />{" "}
                  {/* Adjusted icon size for mobile */}
                </Link>

                {/* Group Icon */}
                <button
                  onClick={togglePopup}
                  className={`p-1 sm:p-2 rounded-full ${
                    darkMode
                      ? "hover:bg-white hover:text-black"
                      : "hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <FaUsers className="text-lg sm:text-xl" />{" "}
                  {/* Adjusted icon size for mobile */}
                </button>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-1 sm:p-2 rounded-full ${
                darkMode
                  ? "hover:bg-white hover:text-black"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              {darkMode ? (
                <FaSun className="text-lg sm:text-xl" /> // Adjusted icon size for mobile
              ) : (
                <FaMoon className="text-lg sm:text-xl" /> // Adjusted icon size for mobile
              )}
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
