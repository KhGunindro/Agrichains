import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function OTPverification({ darkMode }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage('');
            }, 4000); // Hide after 4 seconds

            return () => clearTimeout(timer); // Cleanup on unmount or re-render
        }
    }, [alertMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/account/signup/verify-otp`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${Cookies.get("verificationToken")}`
                },
                body: JSON.stringify({ otp }),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                setTimeout(() => {
                    navigate("/auth"); // if the otp verification failed, navigate the use to '/auth'
                }, 3000);
                setAlertType('Failed');
                throw new Error(errorData.message);
            }
            const data = await response.json();
            setAlertType('Success');
            setAlertMessage(`${data.message}✅`); // add delay
            Cookies.set("token", data.token);
            window.location.href = `${import.meta.env.VITE_AGRICHAINS}`; // Navigates in the same tab
        } catch (error) {
            setAlertMessage(error.message);
        } finally {
            setOtp(""); // clear input field regardless of success or failure
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
            <div className={`w-full max-w-sm mx-4 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h2 className={`text-3xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Confirm OTP
                </h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            placeholder="Enter your OTP here..."
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${darkMode
                                ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500"
                                : "border-gray-300 focus:ring-green-600"
                                }`}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold ${isLoading
                            ? "bg-green-700 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                            } text-white transition-colors`}
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
                                Confirming...
                            </>
                        ) : (
                            'Confirm OTP'
                        )}
                    </button>
                </form>

                {/* Custom Alert Box */}
                {alertMessage && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className={`w-full max-w-sm mx-4 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {alertType}!
                            </h3>
                            <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {alertMessage}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
