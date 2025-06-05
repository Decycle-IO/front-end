// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title IEmailVerifier
 * @dev Interface for email verification using vlayer
 */
interface IEmailVerifier {
    /**
     * @dev Struct for unverified email data
     */
    struct UnverifiedEmailData {
        string email;
        string[] dnsRecords;
        bytes signature;
    }

    /**
     * @dev Struct for verified email result
     */
    struct VerifiedEmailResult {
        bytes32 emailHash;
        address wallet;
        bool isValid;
    }

    /**
     * @dev Verifies an email using vlayer
     * @param unverifiedEmail The unverified email data
     * @param wallet The wallet address to link with the email
     * @return The verified email result
     */
    function verifyEmail(UnverifiedEmailData calldata unverifiedEmail, address wallet) 
        external view returns (VerifiedEmailResult memory);
}
