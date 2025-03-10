import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from "./components/Container.component";
import heroImage from "./assets/cute_plant.png";
import Developers from "./components/Developers.component";
import Navbar from "./components/Navbar.component";
import Arrow from "./assets/arrow_right_up.png";
// pages
import Contact from "./pages/Contact.page";
import Documentation from "./pages/Documentation.page";

const App = () => {
  // Retrieve theme preference from localStorage or default to light mode
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return !!(savedTheme === "true"); // Default to light mode if no preference is found
  });

  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const [visible, setVisible] = useState(true); // Control navbar visibility

  // Ref for the developer section
  const developersRef = useRef(null);

  // Save theme preference to localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("theme", darkMode.toString()); // Save as a string ("true" or "false")
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode); // Toggle dark mode
  };

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
    <Router>
      <div
        className={`min-h-screen flex flex-col ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Navbar */}
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          togglePopup={togglePopup}
          scrollToTop={scrollToTop}
          visible={visible}
        />

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
                        className={`text-[25px] sm:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Welcome to{" "}
                        <span className="text-green-600">AgriChains</span>
                      </h1>

                      {/* Description */}
                      <p
                        className={`text-sm text-left sm:text-base lg:text-lg max-w-[90%] md:max-w-[80%] md:mx-0 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Discover the future of agriculture with AgriChains.
                        Follow the steps below to get started and explore the
                        platform's features.
                      </p>

                      {/* Tagline */}
                      <p
                        className={`mt-5 text-sm sm:text-[16px] text-left italic ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        — Cultivating trust, growing transparency
                      </p>
                    </div>

                    {/* Image - Hidden on Mobile */}
                    <div className="hidden md:flex md:w-1/2 justify-center items-center mt-10 md:mt-0">
                      <img
                        src={heroImage}
                        alt="AgriChains Hero"
                        className="w-[40%] md:w-[22%] h-auto object-contain rounded-lg transition-transform duration-300 hover:rotate-12 group cursor-pointer"
                      />
                    </div>
                  </motion.div>

                  {/* Tutorial Components */}
                  <Container
                    image="https://cdn.pixabay.com/photo/2021/05/26/13/49/bitcoin-6285239_1280.jpg"
                    text="Step 1: Go to the website and sign up."
                    position="left"
                    darkMode={darkMode}
                  />
                  <Container
                    image="https://cdn.pixabay.com/photo/2018/01/18/07/31/bitcoin-3089728_960_720.jpg"
                    text="Step 2: Explore the features and tools available."
                    position="right"
                    darkMode={darkMode}
                  />
                  <Container
                    image="https://cdn.pixabay.com/photo/2022/01/14/07/48/digitization-6936701_1280.jpg"
                    text="Step 3: Customize your profile settings."
                    position="left"
                    darkMode={darkMode}
                  />
                  <Container
                    image="https://cdn.pixabay.com/photo/2018/03/07/19/41/blockchain-3206918_1280.png"
                    text="Step 4: Start using the platform to achieve your goals."
                    position="right"
                    darkMode={darkMode}
                  />
                  <Container
                    image="https://cdn.pixabay.com/photo/2021/10/09/12/57/world-6694125_960_720.jpg"
                    text="Step 5: Connect with other users and collaborate."
                    position="left"
                    darkMode={darkMode}
                  />
                  <Container
                    image="https://cdn.pixabay.com/photo/2022/01/17/09/01/binary-6944162_1280.jpg"
                    text="Step 6: Enjoy the full experience of the platform."
                    position="right"
                    darkMode={darkMode}
                  />
                </div>

                {/* Navigate Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center sm:my-24 sm:mt-10"
                >
                  <a
                    href="https://agrichains.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-4 sm:px-5 sm:py-5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-green-800 text-xl sm:text-3xl font-semibold drop-shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Go To DApp
                    <img src={Arrow} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
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
                      className={`text-2xl md:text-4xl font-bold mb-4 sm:mb-8 ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      Meet the <span className="text-green-600">FUTURE</span>{" "}
                      team
                    </h2>
                  </motion.div>
                  <Developers />
                </div>
              </>
            }
          />
          {/* Contact Page Route */}
          <Route path="/contact" element={<Contact darkMode={darkMode} />} />
          {/* Documentation Page Route */}
          <Route path="/contact" element={<Documentation darkMode={darkMode} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
