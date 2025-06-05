// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TestUSDC
 * @dev Mock USDC token for testing
 */
contract TestUSDC is ERC20, Ownable, ReentrancyGuard {
    /**
     * @dev Number of decimals for the token
     */
    uint8 private _decimals;

    /**
     * @dev Constructor
     * @param initialOwner The initial owner of the contract
     */
    constructor(address initialOwner) ERC20("Test USDC", "tUSDC") Ownable(initialOwner) {
        _decimals = 6; // USDC has 6 decimals
    }

    /**
     * @dev Returns the number of decimals used to get its user representation
     */
    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Mints tokens to a specified address
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner nonReentrant {
        _mint(to, amount);
    }

    /**
     * @dev Burns tokens from the caller
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external nonReentrant {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Burns tokens from a specified address
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) external nonReentrant {
        uint256 currentAllowance = allowance(from, msg.sender);
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(from, msg.sender, currentAllowance - amount);
        }
        _burn(from, amount);
    }

    /**
     * @dev Mints tokens to multiple addresses
     * @param recipients Array of addresses to mint tokens to
     * @param amounts Array of amounts to mint
     */
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner nonReentrant {
        require(recipients.length == amounts.length, "TestUSDC: recipients and amounts length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Mints a fixed amount of tokens to the caller
     * @return The amount of tokens minted
     */
    function faucet() external nonReentrant returns (uint256) {
        uint256 amount = 1000 * 10**_decimals; // 1000 USDC
        _mint(msg.sender, amount);
        return amount;
    }
}
