// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "../../lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/ITrashToken.sol";

/**
 * @title TrashToken
 * @dev ERC20 token for the gamified recycling system
 */
contract TrashToken is ERC20, ERC20Burnable, Ownable, Pausable, ReentrancyGuard, ITrashToken {
    /**
     * @dev Error thrown when the caller is not authorized to mint tokens
     */
    error UnauthorizedMinter();

    /**
     * @dev Error thrown when the caller is not authorized to burn tokens
     */
    error UnauthorizedBurner();

    /**
     * @dev Error thrown when the amount is zero
     */
    error ZeroAmount();

    /**
     * @dev Error thrown when the address is zero
     */
    error ZeroAddress();

    /**
     * @dev Mapping of addresses authorized to mint tokens
     */
    mapping(address => bool) internal _authorizedMinters;

    /**
     * @dev Mapping of addresses authorized to burn tokens
     */
    mapping(address => bool) internal _authorizedBurners;

    /**
     * @dev Emitted when a minter is authorized
     */
    event MinterAuthorized(address indexed minter);

    /**
     * @dev Emitted when a minter is unauthorized
     */
    event MinterUnauthorized(address indexed minter);

    /**
     * @dev Emitted when a burner is authorized
     */
    event BurnerAuthorized(address indexed burner);

    /**
     * @dev Emitted when a burner is unauthorized
     */
    event BurnerUnauthorized(address indexed burner);

    /**
     * @dev Constructor
     * @param initialOwner The initial owner of the contract
     */
    constructor(address initialOwner) ERC20("TRASH", "TRASH") Ownable(initialOwner) {
        // Authorize the owner as a minter and burner
        _authorizedMinters[initialOwner] = true;
        _authorizedBurners[initialOwner] = true;
    }

    /**
     * @dev Modifier to check if the caller is authorized to mint tokens
     */
    modifier onlyAuthorizedMinter() {
        if (!_authorizedMinters[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedMinter();
        }
        _;
    }

    /**
     * @dev Modifier to check if the caller is authorized to burn tokens
     */
    modifier onlyAuthorizedBurner() {
        if (!_authorizedBurners[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedBurner();
        }
        _;
    }

    /**
     * @dev Checks if an address is authorized to mint tokens
     * @param minter The address to check
     * @return Whether the address is authorized to mint tokens
     */
    function isAuthorizedMinter(address minter) external view returns (bool) {
        return _authorizedMinters[minter];
    }

    /**
     * @dev Checks if an address is authorized to burn tokens
     * @param burner The address to check
     * @return Whether the address is authorized to burn tokens
     */
    function isAuthorizedBurner(address burner) external view returns (bool) {
        return _authorizedBurners[burner];
    }

    /**
     * @dev Authorizes an address to mint tokens
     * @param minter The address to authorize
     */
    function authorizeMinter(address minter) external onlyOwner {
        if (minter == address(0)) {
            revert ZeroAddress();
        }
        _authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }

    /**
     * @dev Unauthorizes an address to mint tokens
     * @param minter The address to unauthorize
     */
    function unauthorizeMinter(address minter) external onlyOwner {
        _authorizedMinters[minter] = false;
        emit MinterUnauthorized(minter);
    }

    /**
     * @dev Authorizes an address to burn tokens
     * @param burner The address to authorize
     */
    function authorizeBurner(address burner) external onlyOwner {
        if (burner == address(0)) {
            revert ZeroAddress();
        }
        _authorizedBurners[burner] = true;
        emit BurnerAuthorized(burner);
    }

    /**
     * @dev Unauthorizes an address to burn tokens
     * @param burner The address to unauthorize
     */
    function unauthorizeBurner(address burner) external onlyOwner {
        _authorizedBurners[burner] = false;
        emit BurnerUnauthorized(burner);
    }

    /**
     * @dev Pauses token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Mints tokens to a specified address
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyAuthorizedMinter nonReentrant {
        if (to == address(0)) {
            revert ZeroAddress();
        }
        if (amount == 0) {
            revert ZeroAmount();
        }
        _mint(to, amount);
    }

    /**
     * @dev Batch mints tokens to multiple addresses
     * @param recipients The addresses to mint tokens to
     * @param amounts The amounts of tokens to mint to each address
     */
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) external onlyAuthorizedMinter nonReentrant {
        if (recipients.length != amounts.length) {
            revert("Array lengths must match");
        }
        
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) {
                revert ZeroAddress();
            }
            if (amounts[i] == 0) {
                revert ZeroAmount();
            }
            _mint(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Burns tokens from the caller's address
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) public override(ERC20Burnable, ITrashToken) whenNotPaused nonReentrant {
        if (amount == 0) {
            revert ZeroAmount();
        }
        super.burn(amount);
    }
    
    /**
     * @dev Burns tokens from a specified address
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) public override(ERC20Burnable, ITrashToken) whenNotPaused nonReentrant {
        if (from == address(0)) {
            revert ZeroAddress();
        }
        if (amount == 0) {
            revert ZeroAmount();
        }
        super.burnFrom(from, amount);
    }
    
    /**
     * @dev Burns tokens from a specified address (only for authorized burners)
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnAsAuthorized(address from, uint256 amount) external onlyAuthorizedBurner nonReentrant {
        if (from == address(0)) {
            revert ZeroAddress();
        }
        if (amount == 0) {
            revert ZeroAmount();
        }
        _burn(from, amount);
    }

    /**
     * @dev Hook that is called before any transfer of tokens
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._update(from, to, amount);
    }

    /**
     * @dev Override for the totalSupply function from ITrashToken
     */
    function totalSupply() public view override(ERC20, ITrashToken) returns (uint256) {
        return super.totalSupply();
    }

    /**
     * @dev Override for the balanceOf function from ITrashToken
     */
    function balanceOf(address account) public view override(ERC20, ITrashToken) returns (uint256) {
        return super.balanceOf(account);
    }

    /**
     * @dev Override for the transfer function from ITrashToken
     */
    function transfer(address to, uint256 amount) public override(ERC20, ITrashToken) returns (bool) {
        return super.transfer(to, amount);
    }

    /**
     * @dev Override for the allowance function from ITrashToken
     */
    function allowance(address owner, address spender) public view override(ERC20, ITrashToken) returns (uint256) {
        return super.allowance(owner, spender);
    }

    /**
     * @dev Override for the approve function from ITrashToken
     */
    function approve(address spender, uint256 amount) public override(ERC20, ITrashToken) returns (bool) {
        return super.approve(spender, amount);
    }

    /**
     * @dev Override for the transferFrom function from ITrashToken
     */
    function transferFrom(address from, address to, uint256 amount) public override(ERC20, ITrashToken) returns (bool) {
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Batch transfers tokens to multiple addresses
     * @param recipients The addresses to transfer tokens to
     * @param amounts The amounts of tokens to transfer to each address
     */
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external whenNotPaused nonReentrant {
        if (recipients.length != amounts.length) {
            revert("Array lengths must match");
        }
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        if (balanceOf(msg.sender) < totalAmount) {
            revert("Insufficient balance");
        }
        
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) {
                revert ZeroAddress();
            }
            _transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
}
