// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title EmailVerifierTest
 * @dev Tests for EmailVerifier contract
 */
contract EmailVerifierTest is BaseTest {
    // Test variables
    // Using EMAIL_HASH from BaseTest
    bytes32 constant EMAIL_HASH_2 = keccak256(abi.encodePacked("user2@example.com"));
    uint256 constant VERIFICATION_EXPIRY = 7 days;
    
    function setUp() public override {
        super.setUp();
        
        // Deploy EmailVerifier
        emailVerifier = new EmailVerifier(owner);
    }
    
    /**
     * @dev Test constructor and initial state
     */
    function testConstructor() public {
        // Check owner
        assertEq(emailVerifier.owner(), owner);
        
        // Check that owner is authorized as verifier
        assertTrue(emailVerifier.isAuthorizedVerifier(owner));
        
        // Check that other addresses are not authorized
        assertFalse(emailVerifier.isAuthorizedVerifier(user1));
    }
    
    /**
     * @dev Test constructor with zero address for owner
     */
    function testConstructorZeroAddressOwner() public {
        vm.expectRevert();
        new EmailVerifier(address(0));
    }
    
    /**
     * @dev Test authorizing a verifier
     */
    function testAuthorizeVerifier() public {
        // Authorize verifier
        vm.prank(owner);
        emailVerifier.authorizeVerifier(user1);
        
        // Check that user1 is authorized
        assertTrue(emailVerifier.isAuthorizedVerifier(user1));
    }
    
    /**
     * @dev Test authorizing a verifier by non-owner
     */
    function testAuthorizeVerifierByNonOwner() public {
        // Try to authorize verifier as non-owner
        vm.prank(user1);
        vm.expectRevert();
        emailVerifier.authorizeVerifier(user2);
    }
    
    /**
     * @dev Test revoking a verifier
     */
    function testRevokeVerifier() public {
        // Authorize verifier
        vm.prank(owner);
        emailVerifier.authorizeVerifier(user1);
        assertTrue(emailVerifier.isAuthorizedVerifier(user1));
        
        // Revoke verifier
        vm.prank(owner);
        emailVerifier.revokeVerifier(user1);
        
        // Check that user1 is no longer authorized
        assertFalse(emailVerifier.isAuthorizedVerifier(user1));
    }
    
    /**
     * @dev Test revoking a verifier by non-owner
     */
    function testRevokeVerifierByNonOwner() public {
        // Authorize verifier
        vm.prank(owner);
        emailVerifier.authorizeVerifier(user1);
        
        // Try to revoke verifier as non-owner
        vm.prank(user2);
        vm.expectRevert();
        emailVerifier.revokeVerifier(user1);
    }
    
    /**
     * @dev Test verifying an email
     */
    function testVerifyEmail() public {
        // Verify email
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Check verification status
        assertTrue(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
        
        // Check verification timestamp
        assertEq(emailVerifier.getVerificationTimestamp(user1, EMAIL_HASH), block.timestamp);
    }
    
    /**
     * @dev Test verifying an email by authorized verifier
     */
    function testVerifyEmailByAuthorizedVerifier() public {
        // Authorize verifier
        vm.prank(owner);
        emailVerifier.authorizeVerifier(user2);
        
        // Verify email
        vm.prank(user2);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Check verification status
        assertTrue(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
    }
    
    /**
     * @dev Test verifying an email by unauthorized verifier
     */
    function testVerifyEmailByUnauthorizedVerifier() public {
        // Try to verify email as unauthorized verifier
        vm.prank(user2);
        vm.expectRevert();
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
    }
    
    /**
     * @dev Test verifying an email for zero address
     */
    function testVerifyEmailForZeroAddress() public {
        // Try to verify email for zero address
        vm.prank(owner);
        vm.expectRevert();
        emailVerifier.verifyEmail(address(0), EMAIL_HASH);
    }
    
    /**
     * @dev Test verifying with empty email hash
     */
    function testVerifyEmailWithEmptyHash() public {
        // Try to verify with empty email hash
        vm.prank(owner);
        vm.expectRevert();
        emailVerifier.verifyEmail(user1, bytes32(0));
    }
    
    /**
     * @dev Test verifying an already verified email
     */
    function testVerifyAlreadyVerifiedEmail() public {
        // Verify email
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Verify again
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Check verification status
        assertTrue(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
    }
    
    /**
     * @dev Test verifying multiple emails for the same user
     */
    function testVerifyMultipleEmailsForSameUser() public {
        // Verify first email
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Verify second email
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH_2);
        
        // Check verification status
        assertTrue(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
        assertTrue(emailVerifier.isEmailVerified(user1, EMAIL_HASH_2));
    }
    
    /**
     * @dev Test verifying the same email for multiple users
     */
    function testVerifySameEmailForMultipleUsers() public {
        // Verify email for first user
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Verify email for second user
        vm.prank(owner);
        emailVerifier.verifyEmail(user2, EMAIL_HASH);
        
        // Check verification status
        assertTrue(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
        assertTrue(emailVerifier.isEmailVerified(user2, EMAIL_HASH));
    }
    
    /**
     * @dev Test revoking an email verification
     */
    function testRevokeEmailVerification() public {
        // Verify email
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Revoke verification
        vm.prank(owner);
        emailVerifier.revokeEmailVerification(user1, EMAIL_HASH);
        
        // Check verification status
        assertFalse(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
        
        // Check verification timestamp
        assertEq(emailVerifier.getVerificationTimestamp(user1, EMAIL_HASH), 0);
    }
    
    /**
     * @dev Test revoking an email verification by authorized verifier
     */
    function testRevokeEmailVerificationByAuthorizedVerifier() public {
        // Verify email
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Authorize verifier
        vm.prank(owner);
        emailVerifier.authorizeVerifier(user2);
        
        // Revoke verification
        vm.prank(user2);
        emailVerifier.revokeEmailVerification(user1, EMAIL_HASH);
        
        // Check verification status
        assertFalse(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
    }
    
    /**
     * @dev Test revoking an email verification by unauthorized verifier
     */
    function testRevokeEmailVerificationByUnauthorizedVerifier() public {
        // Verify email
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Try to revoke verification as unauthorized verifier
        vm.prank(user2);
        vm.expectRevert();
        emailVerifier.revokeEmailVerification(user1, EMAIL_HASH);
    }
    
    /**
     * @dev Test revoking a non-verified email
     */
    function testRevokeNonVerifiedEmail() public {
        // Try to revoke non-verified email
        vm.prank(owner);
        emailVerifier.revokeEmailVerification(user1, EMAIL_HASH);
        
        // Check verification status
        assertFalse(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
    }
    
    /**
     * @dev Test batch verifying emails
     */
    function testBatchVerifyEmails() public {
        // Set up users and email hashes
        address[] memory users = new address[](3);
        users[0] = user1;
        users[1] = user2;
        users[2] = user3;
        
        bytes32[] memory emailHashes = new bytes32[](3);
        emailHashes[0] = EMAIL_HASH;
        emailHashes[1] = EMAIL_HASH_2;
        emailHashes[2] = keccak256(abi.encodePacked("user3@example.com"));
        
        // Batch verify emails
        vm.prank(owner);
        emailVerifier.batchVerifyEmails(users, emailHashes);
        
        // Check verification status
        assertTrue(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
        assertTrue(emailVerifier.isEmailVerified(user2, EMAIL_HASH_2));
        assertTrue(emailVerifier.isEmailVerified(user3, emailHashes[2]));
    }
    
    /**
     * @dev Test batch verifying emails with mismatched arrays
     */
    function testBatchVerifyEmailsMismatchedArrays() public {
        // Set up users and email hashes with different lengths
        address[] memory users = new address[](3);
        users[0] = user1;
        users[1] = user2;
        users[2] = user3;
        
        bytes32[] memory emailHashes = new bytes32[](2);
        emailHashes[0] = EMAIL_HASH;
        emailHashes[1] = EMAIL_HASH_2;
        
        // Try to batch verify with mismatched arrays
        vm.prank(owner);
        vm.expectRevert();
        emailVerifier.batchVerifyEmails(users, emailHashes);
    }
    
    /**
     * @dev Test batch verifying emails by unauthorized verifier
     */
    function testBatchVerifyEmailsByUnauthorizedVerifier() public {
        // Set up users and email hashes
        address[] memory users = new address[](2);
        users[0] = user1;
        users[1] = user2;
        
        bytes32[] memory emailHashes = new bytes32[](2);
        emailHashes[0] = EMAIL_HASH;
        emailHashes[1] = EMAIL_HASH_2;
        
        // Try to batch verify as unauthorized verifier
        vm.prank(user3);
        vm.expectRevert();
        emailVerifier.batchVerifyEmails(users, emailHashes);
    }
    
    /**
     * @dev Test batch revoking email verifications
     */
    function testBatchRevokeEmailVerifications() public {
        // Verify emails
        vm.startPrank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        emailVerifier.verifyEmail(user2, EMAIL_HASH_2);
        vm.stopPrank();
        
        // Set up users and email hashes
        address[] memory users = new address[](2);
        users[0] = user1;
        users[1] = user2;
        
        bytes32[] memory emailHashes = new bytes32[](2);
        emailHashes[0] = EMAIL_HASH;
        emailHashes[1] = EMAIL_HASH_2;
        
        // Batch revoke verifications
        vm.prank(owner);
        emailVerifier.batchRevokeEmailVerifications(users, emailHashes);
        
        // Check verification status
        assertFalse(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
        assertFalse(emailVerifier.isEmailVerified(user2, EMAIL_HASH_2));
    }
    
    /**
     * @dev Test checking verification expiry
     */
    function testVerificationExpiry() public {
        // Verify email
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Check verification is valid
        assertTrue(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
        
        // Fast forward time to just before expiry
        vm.warp(block.timestamp + VERIFICATION_EXPIRY - 1);
        
        // Check verification is still valid
        assertTrue(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
        
        // Fast forward time to after expiry
        vm.warp(block.timestamp + 2);
        
        // Check verification is now expired
        assertFalse(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
    }
    
    /**
     * @dev Test setting verification expiry
     */
    function testSetVerificationExpiry() public {
        // Set new verification expiry
        uint256 newExpiry = 30 days;
        vm.prank(owner);
        emailVerifier.setVerificationExpiry(newExpiry);
        
        // Check new expiry
        assertEq(emailVerifier.verificationExpiry(), newExpiry);
        
        // Verify email
        vm.prank(owner);
        emailVerifier.verifyEmail(user1, EMAIL_HASH);
        
        // Fast forward time to after old expiry but before new expiry
        vm.warp(block.timestamp + VERIFICATION_EXPIRY + 1 days);
        
        // Check verification is still valid with new expiry
        assertTrue(emailVerifier.isEmailVerified(user1, EMAIL_HASH));
    }
    
    /**
     * @dev Test setting verification expiry by non-owner
     */
    function testSetVerificationExpiryByNonOwner() public {
        // Try to set verification expiry as non-owner
        vm.prank(user1);
        vm.expectRevert();
        emailVerifier.setVerificationExpiry(30 days);
    }
    
    /**
     * @dev Test transferring ownership
     */
    function testTransferOwnership() public {
        // Transfer ownership
        vm.prank(owner);
        emailVerifier.transferOwnership(user1);
        
        // Check new owner
        assertEq(emailVerifier.owner(), user1);
        
        // Check that old owner can no longer perform owner actions
        vm.prank(owner);
        vm.expectRevert();
        emailVerifier.authorizeVerifier(user2);
        
        // Check that new owner can perform owner actions
        vm.prank(user1);
        emailVerifier.authorizeVerifier(user2);
        assertTrue(emailVerifier.isAuthorizedVerifier(user2));
    }
}
