import React from "react";
import whitePaper from '../assets/whitepaper.pdf';

const Documentation = ({ darkMode }) => {
  const handleDownload = () => {
    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = whitePaper;
    link.download = "whitepaper.pdf"; // Name of the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } p-4 sm:p-8`} // Adjusted padding for mobile
    >
      <div
        className={`rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-6xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`} // Dark mode background for container
      >
        {/* PDF Embed */}
        <iframe
          src={whitePaper}
          className={`w-full h-[400px] sm:h-[550px] border ${
            darkMode ? "border-gray-600" : "border-gray-300"
          } rounded-lg mb-6 sm:mb-8`} // Adjusted height for mobile
          title="PDF Viewer"
        ></iframe>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <a
            href={whitePaper}
            target="_blank"
            rel="noopener noreferrer"
            className={`${
              darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg transition duration-300 text-center`} // Centered text and responsive padding
          >
            View PDF
          </a>
          <button
            onClick={handleDownload}
            className={`${
              darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"
            } text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg transition duration-300 text-center`} // Centered text and responsive padding
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;