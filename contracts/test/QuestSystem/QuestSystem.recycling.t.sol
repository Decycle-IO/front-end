// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title QuestSystemRecyclingTest
 * @dev Tests for QuestSystem recycling functionality
 */
contract QuestSystemRecyclingTest is BaseTest {
    // Test constants
    uint256 constant RECYCLING_AMOUNT = 10;
    bytes32 constant TEST_EMAIL_HASH = keccak256(abi.encodePacked("test@example.com"));
    
    function setUp() public override {
        super.setUp();
        
        // Deploy full system
        deployFullSystem();
        
        // Authorize the owner as a recorder
        vm.prank(owner);
        questSystem.authorizeRecorder(owner);
    }
    
    /**
     * @dev Test recording recycling activity
     */
    function testRecordRecycling() public {
        // Create a quest to track progress
        vm.prank(owner);
        uint256 questId = questSystem.createQuest(
            IQuestSystem.QuestType.FIRST_RECYCLER,
            "First Recycler Quest",
            "Recycle your first item",
            1,
            1000 * 10**6,
            false,
            ""
        );
        
        // Record recycling activity
        vm.prank(owner);
        questSystem.recordRecycling(
            TEST_EMAIL_HASH,
            IRecyclingSystem.RecyclableType.PLASTIC,
            RECYCLING_AMOUNT
        );
        
        // Verify email for user1
        vm.startPrank(user1);
        bytes memory proof = abi.encodePacked("proof");
        
        // Mock the email verification
        vm.mockCall(
            address(emailVerifier),
            abi.encodeWithSelector(IEmailVerifier.verifyEmail.selector),
            abi.encode(IEmailVerifier.VerifiedEmailResult({
                emailHash: TEST_EMAIL_HASH,
                wallet: user1,
                isValid: true
            }))
        );
        
        questSystem.verifyEmail(TEST_EMAIL_HASH, proof);
        vm.stopPrank();
        
        // Check quest status
        (uint256 progress, uint256 required, bool completed, bool claimed) = 
            questSystem.getQuestStatus(TEST_EMAIL_HASH, IQuestSystem.QuestType.FIRST_RECYCLER, questId);
        
        // Progress should be at least 1 since we recorded recycling
        assertGe(progress, 1);
        assertEq(required, 1);
        assertTrue(completed);
        assertFalse(claimed);
    }
    
    /**
     * @dev Test recording recycling by unauthorized recorder
     */
    function testRecordRecyclingByUnauthorizedRecorder() public {
        // Try to record recycling as unauthorized recorder
        vm.prank(user1);
        vm.expectRevert();
        questSystem.recordRecycling(
            TEST_EMAIL_HASH,
            IRecyclingSystem.RecyclableType.PLASTIC,
            RECYCLING_AMOUNT
        );
    }
    
    /**
     * @dev Test recording recycling when paused
     */
    function testRecordRecyclingWhenPaused() public {
        // Pause the contract
        vm.prank(owner);
        questSystem.pause();
        
        // Try to record recycling when paused
        vm.prank(owner);
        vm.expectRevert();
        questSystem.recordRecycling(
            TEST_EMAIL_HASH,
            IRecyclingSystem.RecyclableType.PLASTIC,
            RECYCLING_AMOUNT
        );
    }
    
    /**
     * @dev Test verifying email
     */
    function testVerifyEmail() public {
        // Verify email for user1
        vm.startPrank(user1);
        bytes memory proof = abi.encodePacked("proof");
        
        // Mock the email verification
        vm.mockCall(
            address(emailVerifier),
            abi.encodeWithSelector(IEmailVerifier.verifyEmail.selector),
            abi.encode(IEmailVerifier.VerifiedEmailResult({
                emailHash: TEST_EMAIL_HASH,
                wallet: user1,
                isValid: true
            }))
        );
        
        questSystem.verifyEmail(TEST_EMAIL_HASH, proof);
        vm.stopPrank();
        
        // Check that the email is verified
        vm.prank(user1);
        bytes32 verifiedEmail = questSystem.getVerifiedEmail();
        assertEq(verifiedEmail, TEST_EMAIL_HASH);
    }
    
    /**
     * @dev Test verifying email with invalid proof
     */
    function testVerifyEmailWithInvalidProof() public {
        // Try to verify email with invalid proof
        vm.startPrank(user1);
        bytes memory proof = abi.encodePacked("invalid_proof");
        
        // Mock the email verification to fail
        vm.mockCall(
            address(emailVerifier),
            abi.encodeWithSelector(IEmailVerifier.verifyEmail.selector),
            abi.encode(IEmailVerifier.VerifiedEmailResult({
                emailHash: bytes32(0),
                wallet: address(0),
                isValid: false
            }))
        );
        
        vm.expectRevert();
        questSystem.verifyEmail(TEST_EMAIL_HASH, proof);
        vm.stopPrank();
    }
    
    /**
     * @dev Test claiming rewards
     */
    function testClaimRewards() public {
        // Create a quest
        vm.prank(owner);
        uint256 questId = questSystem.createQuest(
            IQuestSystem.QuestType.FIRST_RECYCLER,
            "First Recycler Quest",
            "Recycle your first item",
            1,
            1000 * 10**6,
            false,
            ""
        );
        
        // Record recycling activity
        vm.prank(owner);
        questSystem.recordRecycling(
            TEST_EMAIL_HASH,
            IRecyclingSystem.RecyclableType.PLASTIC,
            RECYCLING_AMOUNT
        );
        
        // Verify email for user1
        vm.startPrank(user1);
        bytes memory proof = abi.encodePacked("proof");
        
        // Mock the email verification
        vm.mockCall(
            address(emailVerifier),
            abi.encodeWithSelector(IEmailVerifier.verifyEmail.selector),
            abi.encode(IEmailVerifier.VerifiedEmailResult({
                emailHash: TEST_EMAIL_HASH,
                wallet: user1,
                isValid: true
            }))
        );
        
        questSystem.verifyEmail(TEST_EMAIL_HASH, proof);
        
        // Claim rewards
        questSystem.claimRewards(IQuestSystem.QuestType.FIRST_RECYCLER, questId);
        vm.stopPrank();
        
        // Check quest status
        (uint256 progress, uint256 required, bool completed, bool claimed) = 
            questSystem.getQuestStatus(TEST_EMAIL_HASH, IQuestSystem.QuestType.FIRST_RECYCLER, questId);
        
        assertGe(progress, 1);
        assertEq(required, 1);
        assertTrue(completed);
        assertTrue(claimed);
        
        // Check that the user received the rewards
        assertEq(trashToken.balanceOf(user1), 1000 * 10**6);
    }
    
    /**
     * @dev Test claiming rewards for uncompleted quest
     */
    function testClaimRewardsForUncompletedQuest() public {
        // Create a quest with high required amount
        vm.prank(owner);
        uint256 questId = questSystem.createQuest(
            IQuestSystem.QuestType.FIRST_RECYCLER,
            "First Recycler Quest",
            "Recycle your first item",
            100, // High required amount
            1000 * 10**6,
            false,
            ""
        );
        
        // Record small recycling activity
        vm.prank(owner);
        questSystem.recordRecycling(
            TEST_EMAIL_HASH,
            IRecyclingSystem.RecyclableType.PLASTIC,
            1 // Small amount
        );
        
        // Verify email for user1
        vm.startPrank(user1);
        bytes memory proof = abi.encodePacked("proof");
        
        // Mock the email verification
        vm.mockCall(
            address(emailVerifier),
            abi.encodeWithSelector(IEmailVerifier.verifyEmail.selector),
            abi.encode(IEmailVerifier.VerifiedEmailResult({
                emailHash: TEST_EMAIL_HASH,
                wallet: user1,
                isValid: true
            }))
        );
        
        questSystem.verifyEmail(TEST_EMAIL_HASH, proof);
        
        // Try to claim rewards for uncompleted quest
        vm.expectRevert();
        questSystem.claimRewards(IQuestSystem.QuestType.FIRST_RECYCLER, questId);
        vm.stopPrank();
    }
    
    /**
     * @dev Test claiming rewards without verified email
     */
    function testClaimRewardsWithoutVerifiedEmail() public {
        // Create a quest
        vm.prank(owner);
        uint256 questId = questSystem.createQuest(
            IQuestSystem.QuestType.FIRST_RECYCLER,
            "First Recycler Quest",
            "Recycle your first item",
            1,
            1000 * 10**6,
            false,
            ""
        );
        
        // Record recycling activity
        vm.prank(owner);
        questSystem.recordRecycling(
            TEST_EMAIL_HASH,
            IRecyclingSystem.RecyclableType.PLASTIC,
            RECYCLING_AMOUNT
        );
        
        // Try to claim rewards without verified email
        vm.prank(user1);
        vm.expectRevert();
        questSystem.claimRewards(IQuestSystem.QuestType.FIRST_RECYCLER, questId);
    }
    
    /**
     * @dev Test claiming rewards for already claimed quest
     */
    function testClaimRewardsForAlreadyClaimedQuest() public {
        // Create a quest
        vm.prank(owner);
        uint256 questId = questSystem.createQuest(
            IQuestSystem.QuestType.FIRST_RECYCLER,
            "First Recycler Quest",
            "Recycle your first item",
            1,
            1000 * 10**6,
            false,
            ""
        );
        
        // Record recycling activity
        vm.prank(owner);
        questSystem.recordRecycling(
            TEST_EMAIL_HASH,
            IRecyclingSystem.RecyclableType.PLASTIC,
            RECYCLING_AMOUNT
        );
        
        // Verify email for user1
        vm.startPrank(user1);
        bytes memory proof = abi.encodePacked("proof");
        
        // Mock the email verification
        vm.mockCall(
            address(emailVerifier),
            abi.encodeWithSelector(IEmailVerifier.verifyEmail.selector),
            abi.encode(IEmailVerifier.VerifiedEmailResult({
                emailHash: TEST_EMAIL_HASH,
                wallet: user1,
                isValid: true
            }))
        );
        
        questSystem.verifyEmail(TEST_EMAIL_HASH, proof);
        
        // Claim rewards
        questSystem.claimRewards(IQuestSystem.QuestType.FIRST_RECYCLER, questId);
        
        // Try to claim rewards again
        vm.expectRevert();
        questSystem.claimRewards(IQuestSystem.QuestType.FIRST_RECYCLER, questId);
        vm.stopPrank();
    }
    
    /**
     * @dev Test setting quest completed
     */
    function testSetQuestCompleted() public {
        // Create a quest
        vm.prank(owner);
        uint256 questId = questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Custom Quest",
            "A custom quest",
            100,
            1000 * 10**6,
            false,
            ""
        );
        
        // Set quest as completed for user1
        vm.prank(owner);
        questSystem.setQuestCompleted(user1, questId, true);
        
        // Check if the quest is completed
        vm.prank(owner);
        bool completed = questSystem.isQuestCompleted(user1, questId);
        assertTrue(completed);
    }
    
    /**
     * @dev Test getting user stats
     */
    function testGetUserStats() public {
        // Get user stats
        vm.prank(owner);
        IQuestSystem.UserStats memory stats = questSystem.getUserStats(user1);
        
        // Stats should be initialized to zero
        assertEq(stats.totalRecycledWeight, 0);
        assertEq(stats.recyclingCount, 0);
        assertEq(stats.stakedAmount, 0);
        assertEq(stats.stakeDuration, 0);
    }
}
