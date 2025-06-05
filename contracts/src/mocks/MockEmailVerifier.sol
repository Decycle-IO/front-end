// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../interfaces/IEmailVerifier.sol";
import "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title MockEmailVerifier
 * @dev Mock contract for email verification without using vlayer
 * @notice This is a simplified version for testing purposes
 */
contract MockEmailVerifier is IEmailVerifier, Ownable {
    // Mapping to store verified emails
    mapping(bytes32 => address) private _verifiedEmails;
    
    /**
     * @dev Error thrown when the wallet address is zero
     */
    error ZeroWalletAddress();

    /**
     * @dev Error thrown when the email format is invalid
     */
    error InvalidEmailFormat();

    /**
     * @dev Constructor
     * @param initialOwner The initial owner of the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Verifies an email (mock implementation)
     * @param unverifiedEmail The unverified email data
     * @param wallet The wallet address to link with the email
     * @return The verified email result
     */
    function verifyEmail(UnverifiedEmailData calldata unverifiedEmail, address wallet) 
        external view override returns (VerifiedEmailResult memory) {
        if (wallet == address(0)) {
            revert ZeroWalletAddress();
        }

        // Basic email format validation
        string memory email = unverifiedEmail.email;
        if (bytes(email).length == 0) {
            revert InvalidEmailFormat();
        }

        // Check for @ symbol in email
        bool hasAtSymbol = false;
        bytes memory emailBytes = bytes(email);
        for (uint i = 0; i < emailBytes.length; i++) {
            if (emailBytes[i] == '@') {
                hasAtSymbol = true;
                break;
            }
        }
        
        if (!hasAtSymbol) {
            revert InvalidEmailFormat();
        }

        // Create hash of the email for privacy
        bytes32 emailHash = sha256(abi.encodePacked(email));
        
        // In a real implementation, we would verify the email using vlayer
        // For this mock, we'll just return a valid result
        return VerifiedEmailResult({
            emailHash: emailHash,
            wallet: wallet,
            isValid: true
        });
    }

    /**
     * @dev Manually set a verified email (for testing)
     * @param emailHash The hash of the email
     * @param wallet The wallet address
     */
    function setVerifiedEmail(bytes32 emailHash, address wallet) external onlyOwner {
        _verifiedEmails[emailHash] = wallet;
    }

    /**
     * @dev Get the wallet address for a verified email hash
     * @param emailHash The hash of the email
     * @return The wallet address
     */
    function getVerifiedWallet(bytes32 emailHash) external view returns (address) {
        return _verifiedEmails[emailHash];
    }
}
