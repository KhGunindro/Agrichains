import React from "react";

const DeveloperPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Developers</h2>
        <ul className="space-y-2">
          <li>Developer 1</li>
          <li>Developer 2</li>
          <li>Developer 3</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DeveloperPopup;
