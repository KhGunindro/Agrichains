import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSun, FaMoon, FaUsers } from "react-icons/fa";
import DeveloperPopup from "./components/DeveloperPopup";
import Container from "./components/Container";
import { Sprout } from "lucide-react";
import heroImage from "./assets/cute_plant.png"; // Import the image

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling animation
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 p-6 flex justify-between items-center ${
          darkMode ? "bg-gray-800/100" : "bg-white/100"
        } drop-shadow-lg z-50`}
      >
        <div className="flex items-center group">
          <Sprout className="h-6 w-6 text-green-600 transition-transform duration-300 group-hover:rotate-12" />
          <span
            className={`text-2xl font-bold bg-clip-text ml-2 ${
              darkMode ? "text-white" : "text-black"
            } cursor-pointer`} // Add cursor-pointer for better UX
            onClick={scrollToTop} // Add onClick event to scroll to the top
          >
            AgriChains
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePopup}
            className={`p-2 rounded-full ${
              darkMode
                ? "hover:bg-white hover:text-black" // White background, black text in dark mode
                : "hover:bg-gray-700 hover:text-white" // Default hover styles in light mode
            }`}
          >
            <FaUsers className="text-xl" />
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "hover:bg-white hover:text-black" // White background, black text in dark mode
                : "hover:bg-gray-700 hover:text-white" // Default hover styles in light mode
            }`}
          >
            {darkMode ? (
              <FaSun className="text-xl" />
            ) : (
              <FaMoon className="text-xl" />
            )}
          </button>
        </div>
      </nav>

      {/* Developer Popup */}
      {showPopup && <DeveloperPopup onClose={togglePopup} />}

      {/* Welcome Text and Image Section */}
      <div className="flex-1 w-full max-w-screen mx-auto px-15 overflow-hidden mt-35">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16" // Flex layout for text and image
        >
          {/* Welcome Text */}
          <div className="text-center md:text-left md:w-1/2 mx-20">
            <h1
              className={`text-5xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome to <span className="text-green-600">AgriChains</span>
            </h1>
            <p
              className={`text-xl ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Discover the future of agriculture with AgriChains. Follow the
              steps below to get started and explore the platform's features.
            </p>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={heroImage} // Use the imported image
              alt="AgriChains Hero"
              className="w-[30%] h-auto object-contain rounded-4xl transition-transform duration-300 hover:rotate-12 group cursor-pointer" // Add hover animation directly to the image
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
        className="flex justify-center my-16"
      >
        <a
          href="https://agrichains.tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-800 text-lg font-semibold drop-shadow-lg transition-transform duration-300 hover:scale-105"
        >
          Get Started
        </a>
      </motion.div>
    </div>
  );
};

export default App;
