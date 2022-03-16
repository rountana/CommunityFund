# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

PROJECT SETUP
--------------

Using React/ Hardhat/Alchemy/ Polygon
-------------------------------------

St 1 - Set up React-Hardhat-ethersjs

npx create-react-app Nader-demo 

St 2 - install dependencies
npm i ethers hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers

St 3 - set up config files, folder structure
npx hardhat

Modify config 
Set path in hardhat.config.js

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },

Artifacts folder has the Abi’s that we can call from the front end

Change script file name to deploy.js

St 4 - start the node 
npx hardhat node

Runs node and gives 20 accounts to use
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 

St 5 - deploy contract
npx hardhat run scripts/deploy.js --network localhost 
O/p
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

St 6 - import account in metamask (using private key)

St 7 - update react code - app.js  

St 8 - run the app
npm start



Set up Polygon/ Alchemy (replace hardhat backend)
—————————————————————————————--------------------
Reference https://docs.alchemy.com/alchemy/tutorials/hello-world-smart-contract - covers polygon/alchemy via js NOT react

St 1
First get an Alchemy account. Get token and api-url

St 2
Install dotenv
npm install dotenv --save

St 3
Create .env file
API_URL = "https://eth-ropsten.alchemyapi.io/v2/your-api-key"
PRIVATE_KEY = "your-metamask-private-key"

St 4
Install ethers-js if not previously installed

St 5
npm install --save-dev @nomiclabs/hardhat-ethers "ethers@^5.0.0"

Change step 3 above to following

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

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
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

St 6
Compile smart contracts
npx hardhat compile

St 7
Update deploy script (deploy.js) with smart contract details

St 8
Deploy to Polygon testnet
npx hardhat run scripts/deploy.js --network mumbai

St 9
Update contract address in .ENV and app.js files

St 10
Check deployment on polygon scan
https://mumbai.polygonscan.com/address/0x3Be78Da9faFF2b8a2F99DacCa7FdE0FE673A78dE

Interacting with Smart Contract


St 11
Insert below code in src/App.js 

Important: for ENV variables to be read via dotenv, they have to follow the REACT_APP_ prefix. All constants should start with the prefix.

Changes made will not reflect at runtime. Need to build again - exit react app and nom start

Pull contract address and keys from env variables.

const API_KEY = process.env.REACT_APP_API_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

St 12

Accessing contract

Replace existing web3 provider with alchemy

      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      const provider = new ethers.providers.AlchemyProvider(
        (network = "maticmum"),
        API_KEY
      );
 }


NON-GUI TESTING VIA HARDHAT
---------------------------

Insert smart contract access code in interact.js
cd to src folder 
npx hardhat run scripts/interact.js --network mumbai



