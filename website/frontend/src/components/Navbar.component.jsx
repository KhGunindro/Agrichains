import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaBars, FaHome } from "react-icons/fa";
import { Sprout } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({
  darkMode,
  toggleDarkMode,
  togglePopup,
  scrollToTop,
  visible,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={`fixed top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center ${
            darkMode ? "bg-gray-800/100" : "bg-white/100"
          } drop-shadow-lg z-50`}
        >
          <div className="flex items-center group">
            <Sprout className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 transition-transform duration-300 group-hover:rotate-12" />
            <Link
              to="/"
              onClick={scrollToTop}
              className={`text-lg sm:text-xl md:text-2xl font-bold bg-clip-text ml-2 ${
                darkMode ? "text-white" : "text-black"
              } cursor-pointer`}
            >
              AgriChains
            </Link>
          </div>

          <div className="hidden sm:flex items-center space-x-3 sm:space-x-4">
            {/* Go to DApp Button (Hidden on / route) */}
            {location.pathname !== "/" && (
              <Link
                to="/auth"
                className={`p-1 font-bold sm:p-2 relative inline-block ${
                  darkMode ? "text-white" : "text-gray-900"
                } hover:no-underline group transition-all duration-300 hover:text-green-600`}
              >
                Go to DApp
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}

            {location.pathname !== "/documentation" && (
              <Link
                to="/documentation"
                className={`p-1 font-bold sm:p-2 relative inline-block ${
                  darkMode ? "text-white" : "text-gray-900"
                } hover:no-underline group transition-all duration-300 hover:text-green-600`}
              >
                Documentation
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}

            {location.pathname !== "/contact" && (
              <Link
                to="/contact"
                className={`p-1 font-bold sm:p-2 relative inline-block ${
                  darkMode ? "text-white" : "text-gray-900"
                } hover:no-underline group transition-all duration-300 hover:text-green-600`}
              >
                Contact Us
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}

            {/* Developers Link (Only Visible on /) */}
            {location.pathname === "/" && (
              <button
                onClick={togglePopup}
                className={`p-1 font-bold sm:p-2 relative inline-block ${
                  darkMode ? "text-white" : "text-gray-900"
                } hover:no-underline group transition-all duration-300 hover:text-green-600`}
              >
                Meet Us
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
            )}

            {/* Home Icon (Hidden on / route) */}
            {location.pathname !== "/" && location.pathname !== "/auth" && (
              <Link
                to="/"
                className={`p-1 sm:p-2 rounded-full flex items-center space-x-2 transition-all duration-300 ${
                  darkMode
                    ? "hover:bg-white hover:text-black"
                    : "hover:bg-gray-700 hover:text-white"
                } hover:scale-110`}
              >
                <FaHome className="text-lg sm:text-xl" />
                <span className="hidden font-bold sm:inline">Home</span>
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-1 sm:p-2 rounded-full transition-all duration-300 ${
                darkMode
                  ? "hover:bg-white hover:text-black"
                  : "hover:bg-gray-700 hover:text-white"
              } hover:scale-110`}
            >
              {darkMode ? (
                <FaSun className="text-lg sm:text-xl" />
              ) : (
                <FaMoon className="text-lg sm:text-xl" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="flex sm:hidden items-center space-x-3">
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
                <FaSun className="text-lg sm:text-xl" />
              ) : (
                <FaMoon className="text-lg sm:text-xl" />
              )}
            </button>

            {/* Menu Bar */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-1 sm:p-2 rounded-full ${
                darkMode
                  ? "hover:bg-white hover:text-black"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaBars className="text-lg sm:text-xl" />
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`absolute top-16 right-4 sm:hidden flex flex-col space-y-2 p-4 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } drop-shadow-lg z-40`}
              >
                {location.pathname !== "/" && location.pathname !== "/auth" && (
                  <Link
                    to="/"
                    className={`p-2 font-bold ${
                      darkMode
                        ? "hover:bg-white hover:text-black"
                        : "hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                )}

                {/* Go to DApp Button (Hidden on / route) */}
                {location.pathname !== "/" && (
                  <Link
                    to="/auth"
                    className={`p-2 font-bold ${
                      darkMode
                        ? "hover:bg-white hover:text-black"
                        : "hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Go to DApp
                  </Link>
                )}

                {location.pathname !== "/documentation" && (
                  <Link
                    to="/documentation"
                    className={`p-2 font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    } hover:no-underline`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Documentation
                  </Link>
                )}

                {location.pathname !== "/contact" && (
                  <Link
                    to="/contact"
                    className={`p-2 font-bold ${
                      darkMode
                        ? "hover:bg-white hover:text-black"
                        : "hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                )}

                {/* Show Developers Button only when on /home */}
                {location.pathname === "/" && (
                  <button
                    onClick={() => {
                      togglePopup();
                      setIsMenuOpen(false);
                    }}
                    className={`p-2 text-left font-bold ${
                      darkMode
                        ? "hover:bg-white hover:text-black"
                        : "hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Meet Us
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
