// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../interfaces/IEmailVerifier.sol";
import "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/Strings.sol";

/**
 * @title EmailVerifier
 * @dev Contract for email verification
 * @notice This is a simplified version that doesn't use vlayer libraries
 * @dev TODO: Implement full vlayer integration when ready
 */
contract EmailVerifier is IEmailVerifier, Ownable {
    using Strings for string;
    
    /**
     * @dev Error thrown when the email verification fails
     */
    error EmailVerificationFailed();

    /**
     * @dev Error thrown when the email format is invalid
     */
    error InvalidEmailFormat();

    /**
     * @dev Error thrown when the wallet address is zero
     */
    error ZeroWalletAddress();

    /**
     * @dev Error thrown when the caller is not authorized
     */
    error UnauthorizedVerifier();

    /**
     * @dev Error thrown when array lengths don't match
     */
    error ArrayLengthMismatch();

    /**
     * @dev Mapping to store verified emails
     * user address => email hash => verification timestamp
     */
    mapping(address => mapping(bytes32 => uint256)) private _verifiedEmails;
    
    /**
     * @dev Mapping to store authorized verifiers
     */
    mapping(address => bool) private _authorizedVerifiers;
    
    /**
     * @dev Verification expiry time in seconds
     */
    uint256 public verificationExpiry = 7 days;
    
    /**
     * @dev Emitted when a verifier is authorized
     */
    event VerifierAuthorized(address indexed verifier);
    
    /**
     * @dev Emitted when a verifier is revoked
     */
    event VerifierRevoked(address indexed verifier);
    
    /**
     * @dev Emitted when an email is verified
     */
    event EmailVerified(address indexed user, bytes32 indexed emailHash);
    
    /**
     * @dev Emitted when an email verification is revoked
     */
    event EmailVerificationRevoked(address indexed user, bytes32 indexed emailHash);
    
    /**
     * @dev Emitted when verification expiry is updated
     */
    event VerificationExpiryUpdated(uint256 newExpiry);

    /**
     * @dev Constructor
     * @param initialOwner The initial owner of the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        // Authorize the owner as a verifier
        _authorizedVerifiers[initialOwner] = true;
        emit VerifierAuthorized(initialOwner);
    }
    
    /**
     * @dev Modifier to check if the caller is authorized to verify emails
     */
    modifier onlyAuthorizedVerifier() {
        if (!_authorizedVerifiers[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedVerifier();
        }
        _;
    }
    
    /**
     * @dev Checks if an address is authorized to verify emails
     * @param verifier The address to check
     * @return Whether the address is authorized
     */
    function isAuthorizedVerifier(address verifier) external view returns (bool) {
        return _authorizedVerifiers[verifier] || verifier == owner();
    }
    
    /**
     * @dev Authorizes an address to verify emails
     * @param verifier The address to authorize
     */
    function authorizeVerifier(address verifier) external onlyOwner {
        _authorizedVerifiers[verifier] = true;
        emit VerifierAuthorized(verifier);
    }
    
    /**
     * @dev Revokes authorization from an address
     * @param verifier The address to revoke
     */
    function revokeVerifier(address verifier) external onlyOwner {
        _authorizedVerifiers[verifier] = false;
        emit VerifierRevoked(verifier);
    }

    /**
     * @dev Verifies an email (simplified implementation)
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
        // For this simplified version, we just return a valid result
        return VerifiedEmailResult({
            emailHash: emailHash,
            wallet: wallet,
            isValid: true
        });
    }
    
    /**
     * @dev Verifies an email for a user
     * @param user The user address
     * @param emailHash The hash of the email
     */
    function verifyEmail(address user, bytes32 emailHash) external onlyAuthorizedVerifier {
        if (user == address(0)) {
            revert ZeroWalletAddress();
        }
        
        if (emailHash == bytes32(0)) {
            revert InvalidEmailFormat();
        }
        
        _verifiedEmails[user][emailHash] = block.timestamp;
        emit EmailVerified(user, emailHash);
    }
    
    /**
     * @dev Checks if an email is verified for a user
     * @param user The user address
     * @param emailHash The hash of the email
     * @return Whether the email is verified
     */
    function isEmailVerified(address user, bytes32 emailHash) external view returns (bool) {
        uint256 verificationTime = _verifiedEmails[user][emailHash];
        if (verificationTime == 0) {
            return false;
        }
        
        // Check if verification has expired
        return (block.timestamp - verificationTime) <= verificationExpiry;
    }
    
    /**
     * @dev Gets the verification timestamp for an email
     * @param user The user address
     * @param emailHash The hash of the email
     * @return The verification timestamp
     */
    function getVerificationTimestamp(address user, bytes32 emailHash) external view returns (uint256) {
        return _verifiedEmails[user][emailHash];
    }
    
    /**
     * @dev Revokes an email verification
     * @param user The user address
     * @param emailHash The hash of the email
     */
    function revokeEmailVerification(address user, bytes32 emailHash) external onlyAuthorizedVerifier {
        delete _verifiedEmails[user][emailHash];
        emit EmailVerificationRevoked(user, emailHash);
    }
    
    /**
     * @dev Batch verifies multiple emails
     * @param users Array of user addresses
     * @param emailHashes Array of email hashes
     */
    function batchVerifyEmails(address[] calldata users, bytes32[] calldata emailHashes) external onlyAuthorizedVerifier {
        if (users.length != emailHashes.length) {
            revert ArrayLengthMismatch();
        }
        
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == address(0)) {
                revert ZeroWalletAddress();
            }
            
            if (emailHashes[i] == bytes32(0)) {
                revert InvalidEmailFormat();
            }
            
            _verifiedEmails[users[i]][emailHashes[i]] = block.timestamp;
            emit EmailVerified(users[i], emailHashes[i]);
        }
    }
    
    /**
     * @dev Batch revokes multiple email verifications
     * @param users Array of user addresses
     * @param emailHashes Array of email hashes
     */
    function batchRevokeEmailVerifications(address[] calldata users, bytes32[] calldata emailHashes) external onlyAuthorizedVerifier {
        if (users.length != emailHashes.length) {
            revert ArrayLengthMismatch();
        }
        
        for (uint256 i = 0; i < users.length; i++) {
            delete _verifiedEmails[users[i]][emailHashes[i]];
            emit EmailVerificationRevoked(users[i], emailHashes[i]);
        }
    }
    
    /**
     * @dev Sets the verification expiry time
     * @param expiry The new expiry time in seconds
     */
    function setVerificationExpiry(uint256 expiry) external onlyOwner {
        verificationExpiry = expiry;
        emit VerificationExpiryUpdated(expiry);
    }
    
    /**
     * @dev Get the wallet address for a verified email hash (legacy function)
     * @param emailHash The hash of the email
     * @return The wallet address
     */
    function getVerifiedWallet(bytes32 emailHash) external view returns (address) {
        // This is a legacy function that doesn't fit the new model
        // We'll just return the zero address
        return address(0);
    }
}
