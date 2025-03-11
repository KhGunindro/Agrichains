import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";
import cutePlant from "../assets/cute_plant.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import authService from '../services/Auth.service'

const Authentication = ({ darkMode }) => {
    const navigate = useNavigate();
    const [isSignInMode, setIsSignInMode] = useState(true);

    const signupSigninToggle = () => {
        setIsSignInMode(!isSignInMode);
    };

    const [showPassword, setShowPassword] = useState(false);
    const [isFieldFocused, setIsFieldFocus] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // loading
    const [isLoading, setIsLoading] = useState(false);

    // form controllers
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    // signup handler
    const signUpHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const response = await authService.signup(userData.username, userData.email, userData.password, userData.confirmPassword);
        console.log("REsponse from jsx file-->", response);
        
        if(!response.success) {
            setUserData("");
            setIsLoading(false);
            return alert(response.message);
        }
        setUserData("");
        setIsLoading(false);
        // if everything is correct navigate the user to the homepage
        navigate('/home');
    }

    // signin handler
    const signInHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // add the main service here
    }

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center mt-[-10%] md:mt-0 ${darkMode ? "bg-gray-900" : "bg-gray-50"
                } p-4 sm:p-8`}
        >
            <div className="flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold bg-clip-text">
                <h2 className="mr-2 font-extrabold text-3xl">AgriChains</h2>
                <img src={cutePlant} alt="Logo" className="rounded-lg transition-transform duration-300 hover:rotate-6 cursor-pointer w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain " />
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
                                <div className="flex items-center gap-4">
                                    <h2 className="text-3xl font-bold">Welcome Back!</h2>
                                    <img
                                        src={cutePlant}
                                        alt="AgriChains Hero"
                                        className="w-10 mt-[-2%] md:w-10 h-auto object-contain rounded-lg transition-transform duration-300 hover:rotate-6 cursor-pointer"
                                    />
                                </div>

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
                                    >
                                        {isLoading ? 'Signing Up...': 'Sign Up'}
                                    </button>
                                    <div className="mt-4">
                                        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            Already have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={signupSigninToggle}
                                                className="text-green-600 font-semibold hover:underline"
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
                                <form className="space-y-4">
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
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
                                    >
                                        Sign In
                                    </button>
                                    <div className="mt-4">
                                        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            No account?{" "}
                                            <button
                                                type="button"
                                                onClick={signupSigninToggle}
                                                className="text-green-600 font-semibold hover:underline"
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
                                    <div className="flex items-center gap-[2.2%]">
                                        <h2 className="text-3xl font-bold mb-4">Welcome to Agrichains!</h2>
                                        <img
                                            src={cutePlant}
                                            alt="AgriChains Hero"
                                            className="w-10 mt-[-6%] md:w-10 h-auto object-contain rounded-lg transition-transform duration-300 hover:rotate-6 cursor-pointer"
                                        />
                                    </div>
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
                                    <form className="space-y-4">
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
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                                    ? "bg-gray-700 border-gray-600 text-white"
                                                    : "border-gray-300"
                                                    } focus:outline-none focus:ring-2 focus:ring-green-600`}
                                                required
                                            />
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
                                        >
                                            Sign Up
                                        </button>
                                        <div className="mt-4">
                                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                Already have an account?{" "}
                                                <button
                                                    type="button"
                                                    onClick={signupSigninToggle}
                                                    className="text-green-600 font-semibold hover:underline"
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
        </div>
    );
};

export default Authentication;