import "./App.css";
import "./index.css";
import { useState } from "react";
import { ethers } from "ethers";
import Fundraiser from "./artifacts/contracts/VCFundraiser.sol/VCFundraiser.json";
import FundraiserFactory from "./artifacts/contracts/VCFactory.sol/VCFactory.json";
import { Tabs, Form, Input, Button, Checkbox, Image } from "antd";
import Fundraiserlogo from "./Fundraiserlogo.jpg";
import searchIcon from "./searchIcon.jpg";

const { TabPane } = Tabs;

// Alchemy API key
const API_KEY = process.env.REACT_APP_API_KEY;
//Metamask private key
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
//Polygon contract address
const CONTRACT_ADDRESS_FUNDRAISER =
  process.env.REACT_APP_CONTRACT_ADDRESS_FUNDRAISER;
const CONTRACT_ADDRESS_FUNDRAISER_FACTORY =
  process.env.REACT_APP_CONTRACT_ADDRESS_FUNDRAISERFACTORY;

function App() {
  const [fundraiserFactory, setFundraiserFactoryValue] = useState(" ");
  const [errorMessage, setErrorMessage] = useState(" ");
  const [defaultAccount, setDefaultAccount] = useState(" ");
  const [userBalance, setUserBalance] = useState("");
  const [chainId, setChainId] = useState("");
  const [fundIndex, setFundIndex] = useState(0);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [fundraiser, setFundraiserValue] = useState("");

  const [managerAddress, setManagerAddress] = useState("");
  const [managerName, setManagerName] = useState("");
  const [website, setWebsite] = useState("");
  const [investmentThesis, setInvestmentThesis] = useState(" ");
  const [image, setImage] = useState(" ");
  const [status, setStatus] = useState(" ");

  const [managerAddressOutput, setManagerAddressOutput] = useState(" ");
  const [managerNameOutput, setManagerNameOutput] = useState(" ");
  const [websiteOutput, setWebsiteOutput] = useState(" ");
  const [investmentThesisOutput, setInvestmentThesisOutput] = useState(" ");
  const [imageOutput, setImageOutput] = useState(" ");
  const [searchValue, setSearchValue] = useState("");

  async function connectWalletHandler() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
          getAccountBalance(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });

      window.ethereum
        .request({ method: "eth_chainId" })
        .then((chain) => {
          setChainId(chain[0]);
          console.log(chainId);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  }

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    const provider = new ethers.providers.AlchemyProvider("maticmum", API_KEY);

    provider
      .getBalance(account)
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  async function updateFund() {
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

    const message = await contract.vcfundraisersCount();
    console.log("VC Fundraise count - before update: " + message);

    console.log("Updating the fund...");
    const tx = await contract.createVCFundraiser(
      managerName,
      website,
      image,
      investmentThesis,
      managerAddress
    );
    await tx.wait();

    const newMessage = await contract.vcfundraisersCount();
    console.log("VC Fundraise count - after update: " + newMessage);

    const fundDeets = await contract
      .retrieveVCFund(fundIndex)
      .then((fundDeets) => {
        console.log(fundDeets);
        setStatus("Done !");
        setManagerName(" ");
        setWebsite(" ");
        setImage(" ");
        setInvestmentThesis(" ");
        setManagerAddress(" ");
      })
      .catch((error) => {
        console.log("error reading smart contract");
      });
  }

  async function retrieveFund() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.AlchemyProvider(
        "maticmum",
        API_KEY
      );
      const signer = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS_FUNDRAISER_FACTORY,
        FundraiserFactory.abi,
        signer
      );
      const fundDeets = await contract
        .retrieveVCFund(Number(fundIndex))
        .then((fundDeets) => {
          setManagerNameOutput(fundDeets._name);
          setWebsiteOutput(fundDeets._url);
          setImageOutput(fundDeets._image);
          setInvestmentThesisOutput(fundDeets._investmentProposal);
          setManagerAddressOutput(fundDeets._fundraiser);
        })
        .catch((error) => {
          console.log("error reading smart contract");
        });
      console.log(fundDeets);
    }
  }

  async function requestAccount() {
    const ethAcc = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("Ethereum account", ethAcc);
  }

  async function Invest() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.AlchemyProvider(
        "maticmum",
        API_KEY
      );
      const signer = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS_FUNDRAISER,
        Fundraiser.abi,
        signer
      );
      try {
        const data = await contract.Invest();
        console.log("Invested.. updates shown: ", data);
      } catch (err) {
        console.log("Error making updates");
      }
    }
  }

  async function checkMyInvestmentsCount() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.AlchemyProvider(
        "maticmum",
        API_KEY
      );
      const signer = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS_FUNDRAISER,
        Fundraiser.abi,
        signer
      );
      try {
        const data = await contract.myInvestments();
        console.log("My Investments Count: ", data);
        setFundraiserValue({ data });

        console.log("Investment data from state:", fundraiser);
      } catch (err) {
        console.log("Error reading investments count");
      }
    }
  }

  return (
    <div className="App wallet">
      <Tabs defaultActiveKey="1" centered size="large">
        <TabPane tab="Introduction" key="1">
          <h1> {"Welcome to AdFund"} </h1>
          <h3>
            A community platform to co-invest in startups through vetted funds
          </h3>
          <label className="App">
            <ul className="container-small">
              <h3>Features</h3>
              <br></br>
              <li> Register and launch a fund</li>
              <li> Raise liquity via tokens </li>
              <li>Find investment opportunities </li>
              <li>Buy/Sell tokens </li>
              <li>Secure NFTs - proof of ownership </li>
              <li>Transfer ownership </li>
            </ul>
          </label>
          <img src={Fundraiserlogo} />
        </TabPane>
        <TabPane tab="Wallet" key="2">
          <h1> {"Welcome to AdFund"} </h1>
          <h2>Please connect to Polygon Network</h2>
          <h3>
            Mumbai matic test ethers can be obtained from{" "}
            <a
              href="https://faucet.polygon.technology/"
              target="_blank"
              rel="noreferrer noopener"
            >
              here
            </a>
          </h3>
          <br />
          <Button type="primary" onClick={connectWalletHandler}>
            {connButtonText}
          </Button>
          <br />
          <br />
          {errorMessage}
          <br />
          <div className="accountDisplay">
            <h3>Wallet connected Address: {defaultAccount}</h3>
          </div>
          <div className="balanceDisplay">
            <h3>Balance: {userBalance} Eth</h3>
          </div>
        </TabPane>
        <TabPane tab="Launch Fund" key="3">
          <div className="container">
            <h3 className="App-header">Register fund</h3>

            <form>
              <label className="description ">
                Account address{" "}
                <input
                  className="card"
                  id="accAddr"
                  type="text"
                  value={managerAddress}
                  placeholder="0x..."
                  onChange={(e) => setManagerAddress(e.target.value)}
                />
              </label>
              <br />
              <br />
              <label className="description ">
                Website{" "}
                <input
                  className="card"
                  id="website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="http://samplefund.com//"
                />
              </label>
              <br />
              <br />
              <label className="description ">
                Fund Lead{" "}
                <input
                  className="card"
                  id="name"
                  type="text"
                  value={managerName}
                  placeholder="name"
                  onChange={(e) => setManagerName(e.target.value)}
                />
              </label>
              <br />
              <br />
              <label className="description-long ">
                Investment Thesis{" "}
                <input
                  className="card"
                  id="investThesis"
                  type="text"
                  value={investmentThesis}
                  onChange={(e) => setInvestmentThesis(e.target.value)}
                />
              </label>
              {/* <label className="description ">
                Image{" "}
                <input
                  className="card"
                  id="image"
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </label> */}
              <br />
              <br />
              {/* <Button className="btn" type="primary" htmlType="submit"> */}
              <Button className="btn" type="primary" onClick={updateFund}>
                {" "}
                Update Contract{" "}
              </Button>
              <label> {status} </label>
            </form>
            <form>
              <br />
              <label>
                {/* <h2>Query Smart Contract</h2> */}
                Fund id{" "}
                <input
                  className="card"
                  id="setText"
                  type="text"
                  value={fundIndex}
                  onChange={(e) => setFundIndex(e.target.value)}
                />{" "}
              </label>
              <br />
              <br />
              <Button className="btn" type="primary" onClick={retrieveFund}>
                {" "}
                Retrieve Contract{" "}
              </Button>
              <div>
                <h4>{managerNameOutput}</h4>
                <h4>{websiteOutput}</h4>
                <h4>{imageOutput}</h4>
                <h4>{investmentThesisOutput}</h4>
                <h4>{managerAddressOutput}</h4>
              </div>
              <br />
              <br />
            </form>
          </div>
        </TabPane>

        <TabPane tab="Invest" key="5">
          <h1>Fund scanner</h1>
          <label className="description ">
            <input
              className="card"
              id="search"
              type="number"
              placeholder="find by id, lead or name"
              onChange={(e) => setFundIndex(e.target.value)}
            />
            <img src={searchIcon} onClick={retrieveFund} />
            <div>
              <h4>{managerNameOutput}</h4>
              <h4>{websiteOutput}</h4>
              <h4>{imageOutput}</h4>
              <h4>{investmentThesisOutput}</h4>
              <h4>{managerAddressOutput}</h4>
            </div>
            <br></br>
            <Button> Invest & Mint proof of ownership</Button>
          </label>
          {/* <div>
            {{ managerNameOutput } != "Shaamaa" ? (
              <Button> Invest </Button>
            ) : (
              <Button> "No portfolios to show"</Button>
            )}
          </div> */}
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
