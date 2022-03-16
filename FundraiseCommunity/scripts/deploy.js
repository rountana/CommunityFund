// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const FundRaise = await hre.ethers.getContractFactory("VCFundraiser");
  const FundRaiseFactory = await hre.ethers.getContractFactory("VCFactory");

  //call contract
  const greeter = await Greeter.deploy("Hello, Shaam!");
  const fundRaise = await FundRaise.deploy(
    "Bob",
    "bob.ethereum.net",
    "bob.jpeg",
    "raising $10M for a renewable startup",
    "0x0D6B3DC24ba914E34fe4099d45812F53650382Da",
    "0x68421E73B06aD1ec0be56d7A4722b52c7dd9BeFA"
  );
  const fundRaiseFactory = await FundRaiseFactory.deploy();

  await greeter.deployed();
  await fundRaise.deployed();
  await fundRaiseFactory.deployed();

  console.log("Greeter deployed to:", greeter.address);
  console.log("FundRaiser deployed to:", fundRaise.address);
  console.log("Factory deployed to:", fundRaiseFactory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
