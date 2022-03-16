/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const { REACT_APP_API_URL, REACT_APP_PRIVATE_KEY, REACT_APP_CONTRACT_ADDRESS } =
  process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.3",
  defaultNetwork: "mumbai",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: { chainId: 31337 },
    mumbai: {
      url: REACT_APP_API_URL,
      accounts: [`0x${REACT_APP_PRIVATE_KEY}`],
    },
  },
};
