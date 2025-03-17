import React from "react";
import { motion } from "framer-motion";
import Phase2 from "../assets/Phase2.svg"; // Replace with the correct path to your image

const HowItWorks = ({ darkMode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`my-12 w-full flex justify-center p-12 rounded-lg ${darkMode ? "bg-gray-900" : "bg-white"}`}
        >
            <div className="w-[90%] max-md:w-full">
                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className={`text-4xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                    HOW AGRICHAINS WORKS
                </motion.h2>

                {/* Image with Gradient Background and Shadow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`flex justify-center mb-12 p-3 rounded-3xl ${darkMode
                        ? "bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl"
                        : "bg-white shadow-lg"
                        }`}
                >
                    <img
                        src={Phase2} // Replace with your image URL
                        alt="How It Works"
                        className="w-full max-w-3xl rounded-lg"
                    />
                </motion.div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Step 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
                    >
                        <h4 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                            1. Smart Contract Development and Compilation
                        </h4>
                        <p className={`text-lg ${darkMode ? "text-white/90" : "text-gray-600"}`}>
                            This is where we write the smart contract code in Solidity, the programming language for Ethereum-based contracts. The code defines the logic, rules, and functionality of the contract.
                        </p>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
                    >
                        <h4 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                            2. Deployment to the Public Testnet Blockchain
                        </h4>
                        <p className={`text-lg ${darkMode ? "text-white/90" : "text-gray-600"}`}>
                            After compilation, the smart contract is deployed to a public testnet blockchain, Sepolia. This is a sandbox environment where we can test the contract.
                        </p>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
                    >
                        <h4 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                            3. Generating Contract ABI and Artifacts
                        </h4>
                        <p className={`text-lg ${darkMode ? "text-white/90" : "text-gray-600"}`}>
                            Once the contract is compiled, the system generates a Contract ABI and other artifacts (like Contract.json). These files contain metadata about the contract, such as function signatures, events, and storage layouts.
                        </p>
                    </motion.div>

                    {/* Step 4 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
                    >
                        <h4 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                            4. Interacting with the Deployed Contract
                        </h4>
                        <p className={`text-lg ${darkMode ? "text-white/90" : "text-gray-600"}`}>
                            This is where users or applications interact with the deployed smart contract. Interactions can include reading data (e.g., querying balances) or writing data (e.g., executing transactions like transferring tokens).
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default HowItWorks;