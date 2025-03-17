require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("dotenv").config(); 

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
    }, // Local Network
    sepolia: {  // Ensure Sepolia network is properly defined
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
  paths: { artifacts: "./client/public/" },
};
