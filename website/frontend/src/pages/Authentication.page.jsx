import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import cutePlant from "../assets/cute_plant.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import authService from '../services/Auth.service';

const Authentication = ({ darkMode }) => {
    const navigate = useNavigate();
    const [isSignInMode, setIsSignInMode] = useState(true);

    const signupSigninToggle = () => {
        setIsSignInMode(!isSignInMode);
        clearInputFields(); // Clear input fields when toggling
    };

    const [showPassword, setShowPassword] = useState(false);
    const [isFieldFocused, setIsFieldFocus] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    // Alert state
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success"); // Can be "success" or "error"

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage('');
            }, 3000); // Hide after 3 seconds

            return () => clearTimeout(timer); // Cleanup on unmount or re-render
        }
    }, [alertMessage]);

    // Form controllers
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Clear input fields
    const clearInputFields = () => {
        setUserData({
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        });
    };

    // Signup handler
    const signUpHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await authService.signup(userData.username, userData.email, userData.password, userData.confirmPassword);
        setIsLoading(false);
        clearInputFields(); // Clear fields regardless of response

        if (response.success) {
            setAlertType("success");
            setAlertMessage(response.data);
            setTimeout(() => {
                navigate('/auth/otp-verify');
                setIsLoading(false);
            }, 3000); // Redirect after 3 seconds
        } else {
            setIsLoading(false);
            setAlertType("error");
            setAlertMessage(response.message || "An error occurred. Please try again.");
        }
    };

    // Signin handler
    const signInHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            const response = await authService.login(userData.email, userData.password);
            if (response.success) {
                setAlertType("success");
                setAlertMessage(response.data);

                // Wait for 2 seconds to show the success message
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Navigate to the external link
                window.location.href = `${import.meta.env.VITE_AGRICHAINS}`; // Navigates in the same tab
            } else {
                setAlertType("error");
                setAlertMessage(response.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            setAlertType("error");
            setAlertMessage(error.message || "An error occurred. Please try again.");
        } finally {
            // Clear input fields regardless of success or failure
            clearInputFields();
            // Stop loading only after navigation is complete
            // Note: `isLoading` will be reset when the component unmounts during navigation
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center mt-[-10%] md:mt-0 ${darkMode ? "bg-gray-900" : "bg-gray-50"
                } p-4 sm:p-8`}
        >
            <div className="flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold bg-clip-text">
                <h2 className="mr-2 font-extrabold text-3xl">AgriChains</h2>
                <img src={cutePlant} alt="Logo" className="rounded-lg transition-transform duration-300 hover:rotate-6 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain " />
            </div>

            <div
                className={`w-full mt-5 max-w-4xl rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row relative ${darkMode ? "bg-gray-800" : "bg-white"
                    }`}
            >
                {/* Background Layer - Only for Desktop */}
                <motion.div
                    initial={{ x: isSignInMode ? 0 : "100%" }}
                    animate={{ x: isSignInMode ? 0 : "100%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-green-600 w-1/2 hidden sm:block"
                />

                {/* Left Side - Only for Desktop */}
                <div className="flex-1 p-8 z-10 hidden sm:block">
                    <AnimatePresence mode="wait">
                        {isSignInMode ? (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="h-full flex flex-col justify-center text-white"
                            >
                                <h2 className="text-3xl font-bold">Welcome Back!</h2>
                                <p className="mb-6">
                                    We're excited to have you here.
                                </p>
                                <p className="italic">
                                    Let's get you signed in!
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="h-full flex flex-col justify-center"
                            >
                                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    Create Account
                                </h2>
                                <form className="space-y-4" onSubmit={signUpHandler}>
                                    <div className="mb-4 sm:mb-6">
                                        <label
                                            htmlFor="signupname"
                                            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                                } mb-2`}
                                        >
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="signupname"
                                            name="signupname"
                                            value={userData.username}
                                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : "border-gray-300"
                                                } focus:outline-none focus:ring-2 focus:ring-green-600`}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4 sm:mb-6">
                                        <label
                                            htmlFor="signupemail"
                                            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                                } mb-2`}
                                        >
                                            Your Email
                                        </label>
                                        <input
                                            type="email"
                                            id="signupemail"
                                            name="signupemail"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : "border-gray-300"
                                                } focus:outline-none focus:ring-2 focus:ring-green-600`}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4 sm:mb-6">
                                        <label
                                            htmlFor="signuppassword"
                                            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}
                                        >
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="signuppassword"
                                                name="signuppassword"
                                                value={userData.password}
                                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                                                    } focus:outline-none focus:ring-2 focus:ring-green-600 pr-10`}
                                                required
                                                onFocus={() => setIsFieldFocus(true)} // Show the icon when input is focused
                                                onBlur={() => setIsFieldFocus(false)} // Hide the icon when input loses focus
                                            />
                                            {/* Show eye icon only when input is focused */}
                                            {isFieldFocused && (
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none hover:cursor-pointer"
                                                    onMouseDown={(e) => e.preventDefault()} // Prevents focus loss when clicking
                                                >
                                                    {showPassword ? (
                                                        <FaEyeSlash className={`${darkMode ? "text-gray-300" : "text-gray-500"}`} />
                                                    ) : (
                                                        <FaEye className={`${darkMode ? "text-gray-300" : "text-gray-500"}`} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-4 sm:mb-6">
                                        <label
                                            htmlFor="signupconfirmpassword"
                                            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                                } mb-2`}
                                        >
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            id="signupconfirmpassword"
                                            name="signupconfirmpassword"
                                            value={userData.confirmPassword}
                                            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : "border-gray-300"
                                                } focus:outline-none focus:ring-2 focus:ring-green-600`}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
                                        disabled={isLoading}
                                    >
                                        <button
                                            type="submit"
                                            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center hover:cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center">
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
                                                    <span>Signing Up...</span>
                                                </div>
                                            ) : (
                                                'Sign Up'
                                            )}
                                        </button>

                                    </button>
                                    <div className="mt-4">
                                        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            Already have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={signupSigninToggle}
                                                className="text-green-600 font-semibold hover:underline hover:cursor-pointer"
                                                disabled={isLoading}
                                            >
                                                Sign In
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side - For both Desktop and Mobile */}
                <div className="flex-1 p-8 z-10">
                    <AnimatePresence mode="wait">
                        {isSignInMode ? (
                            <motion.div
                                key="signin"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    Sign In
                                </h2>
                                <form className="space-y-4" onSubmit={signInHandler}>
                                    <div className="mb-4 sm:mb-6">
                                        <label
                                            htmlFor="email"
                                            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                                } mb-2`}
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : "border-gray-300"
                                                } focus:outline-none focus:ring-2 focus:ring-green-600`}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4 sm:mb-6">
                                        <label
                                            htmlFor="password"
                                            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}
                                        >
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={userData.password}
                                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                                                    } focus:outline-none focus:ring-2 focus:ring-green-600 pr-10`}
                                                required
                                                onFocus={() => setIsFieldFocus(true)} // Show the icon when input is focused
                                                onBlur={() => setIsFieldFocus(false)} // Hide the icon when input loses focus
                                            />
                                            {/* Show eye icon only when input is focused */}
                                            {isFieldFocused && (
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none hover: cursor-pointer"
                                                    onMouseDown={(e) => e.preventDefault()} // Prevents focus loss when clicking
                                                >
                                                    {showPassword ? (
                                                        <FaEyeSlash className={`${darkMode ? "text-gray-300" : "text-gray-500"}`} />
                                                    ) : (
                                                        <FaEye className={`${darkMode ? "text-gray-300" : "text-gray-500"}`} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors hover: cursor-pointer"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 mr-3 text-white"
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
                                                Signing In...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </button>
                                    <div className="mt-4">
                                        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            No account?{" "}
                                            <button
                                                type="button"
                                                onClick={signupSigninToggle}
                                                className="text-green-600 font-semibold hover:underline hover:cursor-pointer"
                                                disabled={isLoading}
                                            >
                                                Sign Up
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <>
                                {/* Desktop View - Invitation Message */}
                                <motion.div
                                    key="invitation"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="hidden sm:block text-white"
                                >
                                    <h2 className="text-3xl font-bold mb-4">Welcome to Agrichains!</h2>
                                    <p className="mb-6">
                                        The platform where everything is as clear as the soil and as green as the fresh grasses.
                                        <br />
                                        <br />
                                        Add or track your products anytime, anywhere, and get the best deals from our partners.
                                    </p>
                                    <p className="italic">Sign up and start your journey with us today!</p>
                                </motion.div>

                                {/* Mobile View - Signup Form */}
                                <motion.div
                                    key="signup-mobile"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="block sm:hidden"
                                >
                                    <h2 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                        Sign Up
                                    </h2>
                                    <form className="space-y-4" onSubmit={signUpHandler}>
                                        <div className="mb-4 sm:mb-6">
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
                                                value={userData.username}
                                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                                    ? "bg-gray-700 border-gray-600 text-white"
                                                    : "border-gray-300"
                                                    } focus:outline-none focus:ring-2 focus:ring-green-600`}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 sm:mb-6">
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
                                                value={userData.email}
                                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                                    ? "bg-gray-700 border-gray-600 text-white"
                                                    : "border-gray-300"
                                                    } focus:outline-none focus:ring-2 focus:ring-green-600`}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 sm:mb-6">
                                            <label
                                                htmlFor="password"
                                                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                                    } mb-2`}
                                            >
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="password"
                                                    name="password"
                                                    value={userData.password}
                                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                                                        } focus:outline-none focus:ring-2 focus:ring-green-600 pr-10`}
                                                    required
                                                    onFocus={() => setIsFieldFocus(true)} // Show the icon when input is focused
                                                    onBlur={() => setIsFieldFocus(false)} // Hide the icon when input loses focus
                                                />
                                                {/* Show eye icon only when input is focused */}
                                                {isFieldFocused && (
                                                    <button
                                                        type="button"
                                                        onClick={togglePasswordVisibility}
                                                        className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                                                        onMouseDown={(e) => e.preventDefault()} // Prevents focus loss when clicking
                                                    >
                                                        {showPassword ? (
                                                            <FaEyeSlash className={`${darkMode ? "text-gray-300" : "text-gray-500"}`} />
                                                        ) : (
                                                            <FaEye className={`${darkMode ? "text-gray-300" : "text-gray-500"}`} />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-4 sm:mb-6">
                                            <label
                                                htmlFor="confirmpassword"
                                                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                                    } mb-2`}
                                            >
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmpassword"
                                                name="confirmpassword"
                                                value={userData.confirmPassword}
                                                onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                                    ? "bg-gray-700 border-gray-600 text-white"
                                                    : "border-gray-300"
                                                    } focus:outline-none focus:ring-2 focus:ring-green-600`}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center">
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
                                                    <span>Signing Up...</span>
                                                </div>
                                            ) : (
                                                'Sign Up'
                                            )}
                                        </button>

                                        <div className="mt-4">
                                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Already have an account?{" "}
                                                <button
                                                    type="button"
                                                    onClick={signupSigninToggle}
                                                    className="text-green-600 font-semibold hover:underline"
                                                    disabled={isLoading}
                                                >
                                                    Sign In
                                                </button>
                                            </p>
                                        </div>
                                    </form>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Custom Alert Box */}
            {alertMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className={`w-full max-w-sm mx-4 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {alertType === "success" ? "Success" : "Error"}
                        </h3>
                        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {alertMessage}!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Authentication;