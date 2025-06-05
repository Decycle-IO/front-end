// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title ITrashToken
 * @dev Interface for the TrashToken contract
 */
interface ITrashToken {
    /**
     * @dev Mints tokens to a specified address
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external;

    /**
     * @dev Batch mints tokens to multiple addresses
     * @param recipients The addresses to mint tokens to
     * @param amounts The amounts of tokens to mint to each address
     */
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) external;

    /**
     * @dev Burns tokens from the caller's address
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external;
    
    /**
     * @dev Burns tokens from a specified address
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) external;
    
    /**
     * @dev Burns tokens from a specified address (only for authorized burners)
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnAsAuthorized(address from, uint256 amount) external;

    /**
     * @dev Returns the total supply of tokens
     * @return The total supply
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the balance of tokens for an address
     * @param account The address to query
     * @return The balance
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Transfers tokens to a specified address
     * @param to The address to transfer to
     * @param amount The amount to transfer
     * @return True if the transfer was successful
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the allowance for a spender
     * @param owner The owner of the tokens
     * @param spender The spender
     * @return The allowance
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Approves a spender to spend tokens
     * @param spender The spender
     * @param amount The amount to approve
     * @return True if the approval was successful
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Transfers tokens from one address to another
     * @param from The address to transfer from
     * @param to The address to transfer to
     * @param amount The amount to transfer
     * @return True if the transfer was successful
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    /**
     * @dev Batch transfers tokens to multiple addresses
     * @param recipients The addresses to transfer tokens to
     * @param amounts The amounts of tokens to transfer to each address
     */
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external;
}
