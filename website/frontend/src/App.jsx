import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Container from "./components/Container.component";
import Container2 from "./components/Container2.component";
import heroImage from "./assets/BoardBanner.png";
import Developers from "./components/TeamFUTURE.component";
import Navbar from "./components/Navbar.component";
import Arrow from "./assets/arrow_right_up.png";
// pages
import Contact from "./pages/Contact.page";
import Documentation from "./pages/Documentation.page";
import Authentication from "./pages/Authentication.page";
import OTPverification from "./pages/OTPverification.page";

// Create a separate component that will use useLocation
const AppContent = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const [visible, setVisible] = useState(true); // Control navbar visibility

  // Ref for the developer section
  const developersRef = useRef(null);

  const togglePopup = () => {
    // Scroll to the developer section
    if (developersRef.current) {
      developersRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling animation
    });
  };

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      setLastScrollY(currentScrollY); // Update last scroll position
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        } `}
    >
      {/* Conditionally render Navbar for all routes except '/auth' */}
      {location.pathname !== "/auth" &&
        location.pathname !== "/auth/otp-verify" && (
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            togglePopup={togglePopup}
            scrollToTop={scrollToTop}
            visible={visible}
          />
        )}

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Welcome Text and Image Section */}
              <div className="flex-1 w-full max-w-screen mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden mt-5 sm:mt-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16"
                >
                  {/* Welcome Text */}
                  <div className="text-left mt-15 md:text-left md:w-1/2 md:pl-10 lg:pl-20">
                    {/* Heading */}
                    <h1
                      className={`text-[25px] sm:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight ${darkMode ? "text-white" : "text-gray-900"
                        } `}
                    >
                      Welcome to{" "}
                      <span className="text-green-600">AgriChains</span>
                    </h1>

                    {/* Description */}
                    <p
                      className={`text-sm text-left sm:text-base lg:text-lg max-w-[90%] md:max-w-[80%] md:mx-0 ${darkMode ? "text-gray-300" : "text-gray-600"
                        } `}
                    >
                      Step into the future of agriculture with AgriChains! Get started now and explore seamless farm-to-market tracking and secure transactions.
                    </p>

                    {/* Tagline */}
                    <p
                      className={`mt-5 text-sm sm:text-[16px] text-left italic ${darkMode ? "text-gray-400" : "text-gray-500"
                        } `}
                    >
                      — Cultivating trust, growing transparency
                    </p>
                  </div>

                  {/* Image - Hidden on Mobile */}
                  <div className="hidden md:flex md:w-1/2 justify-center items-center mt-10">
                    <img
                      src={heroImage}
                      alt="AgriChains Hero"
                      className="w-[40%] sm:w-[45%] h-auto object-contain rounded-lg transition-transform duration-300 group"
                    />
                  </div>
                </motion.div>

                {/* Tutorial Components */}
                <div className={darkMode ? "dark" : ""}>
                  <Container darkMode={darkMode} />
                </div>
              </div>
              <div>
                <Container2 darkMode={darkMode}/>
              </div>

              {/* Navigate Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center sm:my-24 sm:mt-10"
              >
                <Link
                  to="/auth"
                  className="relative flex items-center gap-2 px-6 py-4 sm:px-8 sm:py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700 text-xl sm:text-3xl font-semibold drop-shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden group"
                >
                  {/* Button Text */}
                  <span className="relative z-10">Go To DApp</span>

                  {/* Arrow Icon */}
                  <img
                    src={Arrow}
                    className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-2"
                  />

                  {/* Shiny Overlay Effect */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-0"></div>
                </Link>
              </motion.div>

              {/* Developer Carousel */}
              <div ref={developersRef}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mt-40"
                >
                  <h2
                    className={`text-2xl md:text-4xl font-bold mb-4 sm:mb-8 ${darkMode ? "text-white" : "text-black"
                      } `}
                  >
                    Meet the <span className="text-green-600">FUTURE</span> team
                  </h2>
                </motion.div>
                <Developers />
              </div>
            </>
          }
        />
        {/* Authentication Page Route */}
        <Route path="/auth" element={<Authentication darkMode={darkMode} />} />
        {/* Contact Page Route */}
        <Route path="/contact" element={<Contact darkMode={darkMode} />} />
        {/* Documentation Page Route */}
        <Route
          path="/documentation"
          element={<Documentation darkMode={darkMode} />}
        />
        <Route
          path="/auth/otp-verify"
          element={<OTPverification darkMode={darkMode} />}
        />
      </Routes>
    </div>
  );
};

const App = () => {
  // Retrieve theme preference from localStorage or default to light mode
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return !!(savedTheme === "true"); // Default to light mode if no preference is found
  });

  // Save theme preference to localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("theme", darkMode.toString()); // Save as a string ("true" or "false")
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode); // Toggle dark mode
  };

  return (
    <Router>
      <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </Router>
  );
};

export default App;
