// interact.js

const API_KEY = process.env.REACT_APP_API_KEY;
//Metamask private key
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
//Polygon contract address
const CONTRACT_ADDRESS_GREETER = process.env.REACT_APP_CONTRACT_ADDRESS_GREETER;
const CONTRACT_ADDRESS_FUNDRAISER =
  process.env.REACT_APP_CONTRACT_ADDRESS_FUNDRAISER;
const CONTRACT_ADDRESS_FUNDRAISER_FACTORY =
  process.env.REACT_APP_CONTRACT_ADDRESS_FUNDRAISERFACTORY;

// import Fundraiser from "./artifacts/contracts/VCFundraiser.sol/VCFundraiser.json";
const FundraiserFactory = require("../src/artifacts/contracts/VCFactory.sol/VCFactory.json");

// provider - Alchemy
const provider = new ethers.providers.AlchemyProvider("maticmum", API_KEY);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// contract instance
const contract = new ethers.Contract(
  CONTRACT_ADDRESS_FUNDRAISER_FACTORY,
  FundraiserFactory.abi,
  signer
);

async function main() {
  const message = await contract.vcfundraisersCount();
  console.log("VC Fundraise count: " + message);

  // console.log("Updating the fund...");
  // const tx = await contract.createVCFundraiser(
  //   "Alice",
  //   "http://alice.com",
  //   "nice girl alice",
  //   "Top VC's pitch",
  //   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  // );
  // await tx.wait();

  const newMessage = await contract.vcfundraisersCount();
  console.log("VC Fundraise count: " + newMessage);

  const fundDeets = await contract
    .retrieveVCFund(0)
    .then((fundDeets) => {
      console.log(fundDeets);
    })
    .catch((error) => {
      console.log("error reading smart contract");
    });
  console.log(fundDeets);
}

main();
