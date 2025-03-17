import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from "./components/Container";
import heroImage from "./assets/cute_plant.png";
import Developers from "./components/Developers";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import Arrow from "./assets/arrow_right_up.png";

const App = () => {
  // Retrieve theme preference from localStorage or default to light mode
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    // Check if the saved theme is valid JSON (true or false)
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
                <div className="flex-1 w-full max-w-screen mx-auto px-15 overflow-hidden mt-22 sm:mt-30">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16"
                  >
                    {/* Welcome Text */}
                    <div className="text-center mx-[-15%] md:text-left md:w-1/2 md:mx-20">
                      <h1
                        className={`text-3xl md:text-5xl font-bold mb-4 md:mb-6 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Welcome to{" "}
                        <span className="text-green-600">AgriChains</span>
                      </h1>
                      <p
                        className={`text-[13px] md:text-xl max-w-[95%] mx-auto md:mx-0 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Discover the future of agriculture with AgriChains.
                        Follow the steps below to get started and explore the
                        platform's features.
                      </p>
                    </div>

                    {/* Image */}
                    <div className="md:w-1/2 flex justify-center">
                      <img
                        src={heroImage}
                        alt="AgriChains Hero"
                        className="w-[30%] h-auto object-contain rounded transition-transform duration-300 hover:rotate-12 group cursor-pointer"
                      />
                    </div>
                  </motion.div>

                  {/* Tutorial Components */}
                  <Container
                    image="image1.jpg"
                    text="Step 1: Go to the website and sign up."
                    position="left"
                    darkMode={darkMode}
                  />
                  <Container
                    image="image2.jpg"
                    text="Step 2: Explore the features and tools available."
                    position="right"
                    darkMode={darkMode}
                  />
                  <Container
                    image="image3.jpg"
                    text="Step 3: Customize your profile settings."
                    position="left"
                    darkMode={darkMode}
                  />
                  <Container
                    image="image4.jpg"
                    text="Step 4: Start using the platform to achieve your goals."
                    position="right"
                    darkMode={darkMode}
                  />
                  <Container
                    image="image5.jpg"
                    text="Step 5: Connect with other users and collaborate."
                    position="left"
                    darkMode={darkMode}
                  />
                  <Container
                    image="image6.jpg"
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
                  className="flex justify-center my-5 sm:my-16" // Reduced top margin for mobile (my-8), larger margin for desktop (sm:my-16)
                >
                  <a
                    href="https://agrichains.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-4 sm:px-5 sm:py-5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-green-800 text-xl sm:text-3xl font-semibold drop-shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Go To DApp
                    <img src={Arrow} className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                    {/* Adjusted icon size for mobile */}
                  </a>
                </motion.div>

                {/* Developer Carousel */}
                <div ref={developersRef}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center my-24" // Increased top margin (my-24)
                  >
                    <h2
                      className={`text-3xl md:text-4xl font-bold mb-8 ${
                        darkMode ? "text-white" : "text-gray-900"
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
          <Route
            path="/contact"
            element={<Contact darkMode={darkMode} />} // Pass darkMode as a prop
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
