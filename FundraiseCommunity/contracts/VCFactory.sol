// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VCFundraiser.sol";

//This contreact is to create new instances of VCFundraisers

contract VCFactory {

    VCFundraiser[] private _fundraisers;
    //uint256 constant maxLimit = 10;

    event VCFundraiserCreated(VCFundraiser indexed capraiser, address indexed owner);

    function createVCFundraiser(
        string memory name,
        string memory url,
        string memory image,
        string memory investmentProposal,
        address payable fundraiser
    )

    public {
        VCFundraiser fund = new VCFundraiser(
            name,
            url,
            image,
            investmentProposal,
            fundraiser,
            msg.sender
        );
        _fundraisers.push(fund);
        emit VCFundraiserCreated(fund, msg.sender);
    }

    function vcfundraisersCount() public view returns(uint256) {
        return _fundraisers.length;
    }
    
    function retrieveVCFund (uint fundID)public view returns (string memory _name, string memory _url,  string memory _image, string memory _investmentProposal, address _fundraiser ) {

        VCFundraiser fundRead = _fundraisers[fundID];
        return (fundRead.name(),
        fundRead.url(),
        fundRead.image(),
        fundRead.investmentProposal(),
        fundRead.fundraiser()
        );
    }
}

