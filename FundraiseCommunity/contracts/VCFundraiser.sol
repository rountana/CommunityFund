
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

import  "@openzeppelin/contracts/access/Ownable.sol";

contract VCFundraiser is Ownable {
    //using SafeMath for uint256;
 
    // This is a struct for investment amount and date 
    struct Investment {
        uint256 value;
        uint256 date;
    }

    // address mapping for investments from investors

    mapping(address => Investment[]) private _investments;

    //state variables
    string public name;
    string public url;
    string public image;
    string public investmentProposal;

    // The addresses for the fundraiser and the manager, who is operating on behalf of the the fund 
    address payable public fundraiser;
    //address public fundmanager;

    //adding state variables for the total invetments for a fund amd investment count
    uint256 public totalInvestments;
    uint256 public investmentsCount;

    //events
     event InvestmentReceived(address indexed investor, uint256 value);
     event Withdraw(uint256 fund);

    //constructor 
    constructor(
        string memory _name,
        string memory _url,
        string memory _image,
        string memory _investmentProposal,
        address payable _fundraiser,
        address _fundmanager

    ) public
    {
        name = _name;
        url = _url;
        image = _image;
        investmentProposal = _investmentProposal;
        fundraiser = _fundraiser;
        _transferOwnership(_fundmanager);   // Taking this function from the Ownable contract   
    }

    // this function will fail if called by anyone other than the owner, if sender is the owner 
    //then address will be updated with one passed in the parameter
    // This account will receive all the investments or funds  by investors
    function setFundraiser(address payable _fundraiser) public onlyOwner {
        fundraiser = _fundraiser; 
    }

    // Investments by investors
    // Assumptions 1. The investment is associated with an address
    //2. as the investment round or amount is added the count is incremented[ date and Ether]
    //3. the total will increase accordingly
    //4. And an event depicting the investment to fundraiser is emitted
    // 5. later we can add exchenge rates, tokens etc

    function myInvestmentsCount() public view returns (uint256) {
        return _investments[msg.sender].length;
    }

    //send ether to a contract
    function invest() public payable {
        Investment memory investment = Investment({ // new Investment struct in memory and push taht into Investment array
            value : msg.value,
            date : block.timestamp
        });
        _investments[msg.sender].push(investment);
        totalInvestments =  totalInvestments + msg.value;
        investmentsCount++;

        emit InvestmentReceived(msg.sender, msg.value);

    }

   // returning the details of investment done by investor like date, amount
    function myInvestments() public view returns (
        uint256[] memory values,
        uint256[] memory dates // returning the two arrays
    )
    {
        uint256 count = myInvestmentsCount();// first we count the #investments for the msg.sender
        values = new uint256[](count); // ceating two new arrauys in the memory
        dates = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            Investment storage investment = _investments[msg.sender][i];
            values[i] = investment.value;
            dates[i] = investment.date;
        }
        
        return (values, dates);
    }

    function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;
    fundraiser.transfer(balance);
    emit Withdraw(balance);
    }

   fallback() external payable {
    totalInvestments = totalInvestments + msg.value;
    investmentsCount++;
  }


}


