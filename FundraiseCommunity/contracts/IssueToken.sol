// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyToken is ERC20, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

//get fundName from UX
    constructor(string memory fundName, string memory fundToken) ERC20(fundName, fundToken) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
        //initial grant of 1M tokens for the project and transfer to an addr
        //use safe mint validates if receiving account can accept payment
        //for e.g a valid smart contract address

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    // notes from ERC20.sol
    //  * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
    //  * will be transferred to `to`.
    //  * - when `from` is zero, `amount` tokens will be minted for `to`.
    //  * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
    //  * - `from` and `to` are never both zero.
    //  *
    // emits log after minting
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
