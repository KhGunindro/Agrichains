import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Alert Component
const Alert = ({ type, message, onClose }) => {
  const alertStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed border-l-4 p-4 rounded-lg shadow-lg ${alertStyles[type]}`}
      style={{
        top: "90px", // Adjusted to appear below the navbar
        left: "50%", // Center horizontally
        transform: "translateX(-50%)", // Center horizontally
        zIndex: 1000,
        maxWidth: "90%", // Prevent the alert from being too wide
        width: "auto", // Allow the alert to shrink/grow based on content
      }}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <span className="block sm:inline">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-lg font-semibold focus:outline-none hover:text-gray-900"
        >
          &times;
        </button>
      </div>
    </motion.div>
  );
};

const Contact = ({ darkMode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [userData, setUserData] = useState({
    senderName: "",
    email: "",
    messageType: "feedback", // Default message type
    message: "",
  });

  // Clear input fields
  const clearInputFields = () => {
    setUserData({
      senderName: "",
      email: "",
      messageType: "feedback",
      message: "",
    });
  };

  // Clear alert message after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 4000); // Clear after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/contact/mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: userData.senderName,
          email: userData.email,
          messageType: userData.messageType,
          message: userData.message,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        setAlertType("error");
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setAlertType("success");
      const data = await response.json();
      setAlertMessage(data.message);
    } catch (error) {
      console.log(error);
      setAlertMessage(error.message);
    } finally {
      setIsLoading(false);
      clearInputFields();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"
        }  p-4 sm:p-8`}
    >
      {/* Alert Box */}
      {alertMessage && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row ${darkMode ? "bg-gray-800" : "bg-white"
          }  mt-16 sm:mt-0`}
      >
        {/* Left Side: GET IN TOUCH Message */}
        <div
          className={`w-full md:w-1/2 bg-green-700 text-white p-6 sm:p-8 flex flex-col justify-center`}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            GET IN TOUCH
          </h1>
          <p className="text-sm sm:text-base mb-4">
            Interested in working together? Fill out some info and we will be in
            touch shortly.
          </p>
          <p className="text-xs sm:text-base">We can't wait to hear from you!</p>
        </div>

        {/* Right Side: Input Fields */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`w-full px-3 py-2 rounded-lg border ${darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-green-500"
                    : "border-gray-300 focus:border-green-500"
                  }  focus:outline-none focus:ring-2 focus:ring-green-500`}
                value={userData.senderName}
                onChange={(e) =>
                  setUserData({ ...userData, senderName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full px-3 py-2 rounded-lg border ${darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-green-500"
                    : "border-gray-300 focus:border-green-500"
                  }  focus:outline-none focus:ring-2 focus:ring-green-500`}
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
              >
                Type of Message
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="messageType"
                    value="feedback"
                    checked={userData.messageType === "feedback"}
                    onChange={(e) =>
                      setUserData({ ...userData, messageType: e.target.value })
                    }
                    className={`mr-2 ${darkMode ? "text-green-500" : "text-green-600"
                      }`}
                  />
                  <span className="text-sm">Feedback</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="messageType"
                    value="collaboration"
                    checked={userData.messageType === "collaboration"}
                    onChange={(e) =>
                      setUserData({ ...userData, messageType: e.target.value })
                    }
                    className={`mr-2 ${darkMode ? "text-green-500" : "text-green-600"
                      }`}
                  />
                  <span className="text-sm">Collaboration</span>
                </label>
              </div>
            </div>
            <div>
              <label
                htmlFor="message"
                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className={`w-full px-3 py-2 rounded-lg border ${darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-green-500"
                    : "border-gray-300 focus:border-green-500"
                  }  focus:outline-none focus:ring-2 focus:ring-green-500`}
                value={userData.message}
                onChange={(e) =>
                  setUserData({ ...userData, message: e.target.value })
                }
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className={`w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700  ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Sending message...</span>
                </div>
              ) : (
                "Send message"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;