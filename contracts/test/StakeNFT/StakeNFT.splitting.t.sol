// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title StakeNFTSplittingTest
 * @dev Tests for StakeNFT splitting functionality
 */
contract StakeNFTSplittingTest is BaseTest {
    // Test constants
    uint256 constant STAKE_AMOUNT = 1000 * 10**6; // 1,000 USDC
    uint256 constant SPLIT_AMOUNT_1 = 400 * 10**6; // 400 USDC
    uint256 constant SPLIT_AMOUNT_2 = 600 * 10**6; // 600 USDC
    
    // Test variables
    uint256 tokenId;
    
    function setUp() public override {
        super.setUp();
        
        // Deploy full system
        deployFullSystem();
        
        // Mint a token
        vm.prank(owner);
        tokenId = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT, 10000);
    }
    
    /**
     * @dev Test splitting a token
     */
    function testSplit() public {
        // Split the token
        vm.prank(user1);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = SPLIT_AMOUNT_1;
        amounts[1] = SPLIT_AMOUNT_2;
        uint256[] memory newTokenIds = stakeNFT.splitStake(tokenId, amounts);
        uint256 newTokenId1 = newTokenIds[0];
        uint256 newTokenId2 = newTokenIds[1];
        
        // Check new token ownership
        assertEq(stakeNFT.ownerOf(newTokenId1), user1);
        assertEq(stakeNFT.ownerOf(newTokenId2), user1);
        
        // Check stake amounts
        IStakeNFT.StakeInfo memory stakeInfo1 = stakeNFT.getStakeInfo(newTokenId1);
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(newTokenId2);
        assertEq(stakeInfo1.stakedAmount, SPLIT_AMOUNT_1);
        assertEq(stakeInfo2.stakedAmount, SPLIT_AMOUNT_2);
        
        // Check that original token is burned
        vm.expectRevert();
        stakeNFT.ownerOf(tokenId);
    }
    
    /**
     * @dev Test splitting by non-owner
     */
    function testSplitByNonOwner() public {
        // Try to split as non-owner
        vm.prank(user2);
        vm.expectRevert();
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = SPLIT_AMOUNT_1;
        amounts[1] = SPLIT_AMOUNT_2;
        stakeNFT.splitStake(tokenId, amounts);
    }
    
    /**
     * @dev Test splitting with zero amount
     */
    function testSplitZeroAmount() public {
        // Try to split with zero amount
        vm.prank(user1);
        vm.expectRevert(NFTSplitter.ZeroSplitAmount.selector);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 0;
        amounts[1] = STAKE_AMOUNT;
        stakeNFT.splitStake(tokenId, amounts);
    }
    
    /**
     * @dev Test splitting with amount greater than stake amount
     */
    function testSplitAmountGreaterThanStakeAmount() public {
        // Try to split with amount greater than stake amount
        vm.prank(user1);
        vm.expectRevert(NFTSplitter.InvalidSplitIncrement.selector);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = STAKE_AMOUNT + 1;
        amounts[1] = 0;
        stakeNFT.splitStake(tokenId, amounts);
    }
    
    /**
     * @dev Test splitting with amount equal to stake amount
     */
    function testSplitAmountEqualToStakeAmount() public {
        // Try to split with amount equal to stake amount
        vm.prank(user1);
        vm.expectRevert(NFTSplitter.InvalidSplitCount.selector);
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = STAKE_AMOUNT;
        stakeNFT.splitStake(tokenId, amounts);
    }
    
    /**
     * @dev Test splitting a non-existent token
     */
    function testSplitNonExistentToken() public {
        vm.prank(user1);
        vm.expectRevert();
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = SPLIT_AMOUNT_1;
        amounts[1] = SPLIT_AMOUNT_2;
        stakeNFT.splitStake(999, amounts);
    }
    
    /**
     * @dev Test splitting when paused
     */
    function testSplitWhenPaused() public {
        // Pause the contract
        vm.prank(owner);
        stakeNFT.pause();
        
        // Try to split when paused
        vm.prank(user1);
        vm.expectRevert();
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = SPLIT_AMOUNT_1;
        amounts[1] = SPLIT_AMOUNT_2;
        stakeNFT.splitStake(tokenId, amounts);
        
        // Unpause
        vm.prank(owner);
        stakeNFT.unpause();
        
        // Should work now
        vm.prank(user1);
        uint256[] memory amounts2 = new uint256[](2);
        amounts2[0] = SPLIT_AMOUNT_1;
        amounts2[1] = SPLIT_AMOUNT_2;
        stakeNFT.splitStake(tokenId, amounts2);
    }
    
    /**
     * @dev Test splitting with pending rewards
     */
    function testSplitWithPendingRewards() public {
        // Add rewards to the token
        uint256 rewardAmount = 100 * 10**6; // 100 USDC
        vm.prank(owner);
        stakeNFT.addRewards(tokenId, rewardAmount);
        
        // Check pending rewards before split
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(tokenId);
        assertEq(stakeInfo.accumulatedRewards, rewardAmount);
        
        // Split the token
        vm.prank(user1);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = SPLIT_AMOUNT_1;
        amounts[1] = SPLIT_AMOUNT_2;
        uint256[] memory newTokenIds = stakeNFT.splitStake(tokenId, amounts);
        uint256 newTokenId1 = newTokenIds[0];
        uint256 newTokenId2 = newTokenIds[1];
        
        // Check pending rewards after split
        uint256 expectedReward1 = (rewardAmount * SPLIT_AMOUNT_1) / STAKE_AMOUNT;
        uint256 expectedReward2 = (rewardAmount * SPLIT_AMOUNT_2) / STAKE_AMOUNT;
        
        IStakeNFT.StakeInfo memory stakeInfo1 = stakeNFT.getStakeInfo(newTokenId1);
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(newTokenId2);
        assertEq(stakeInfo1.accumulatedRewards, expectedReward1);
        assertEq(stakeInfo2.accumulatedRewards, expectedReward2);
        
        // Check that total rewards are preserved
        assertEq(stakeInfo1.accumulatedRewards + stakeInfo2.accumulatedRewards, rewardAmount);
    }
    
    /**
     * @dev Test splitting multiple times
     */
    function testSplitMultipleTimes() public {
        // First split
        vm.prank(user1);
        uint256[] memory amounts1 = new uint256[](2);
        amounts1[0] = SPLIT_AMOUNT_1;
        amounts1[1] = SPLIT_AMOUNT_2;
        uint256[] memory newTokenIds1 = stakeNFT.splitStake(tokenId, amounts1);
        uint256 newTokenId1 = newTokenIds1[0];
        uint256 newTokenId2 = newTokenIds1[1];
        
        // Second split
        vm.prank(user1);
        uint256[] memory amounts2 = new uint256[](2);
        amounts2[0] = SPLIT_AMOUNT_1 / 2;
        amounts2[1] = SPLIT_AMOUNT_1 / 2;
        uint256[] memory newTokenIds2 = stakeNFT.splitStake(newTokenId1, amounts2);
        uint256 newTokenId3 = newTokenIds2[0];
        uint256 newTokenId4 = newTokenIds2[1];
        
        // Check stake amounts
        IStakeNFT.StakeInfo memory stakeInfo3 = stakeNFT.getStakeInfo(newTokenId3);
        IStakeNFT.StakeInfo memory stakeInfo4 = stakeNFT.getStakeInfo(newTokenId4);
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(newTokenId2);
        assertEq(stakeInfo3.stakedAmount, SPLIT_AMOUNT_1 / 2);
        assertEq(stakeInfo4.stakedAmount, SPLIT_AMOUNT_1 / 2);
        assertEq(stakeInfo2.stakedAmount, SPLIT_AMOUNT_2);
        
        // Check that original tokens are burned
        vm.expectRevert();
        stakeNFT.ownerOf(tokenId);
        
        vm.expectRevert();
        stakeNFT.ownerOf(newTokenId1);
    }
    
    /**
     * @dev Test splitting with minimum amount
     */
    function testSplitMinimumAmount() public {
        // Try to split with minimum amount ($10)
        vm.prank(user1);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 10 * 10**6; // $10
        amounts[1] = STAKE_AMOUNT - (10 * 10**6);
        uint256[] memory newTokenIds = stakeNFT.splitStake(tokenId, amounts);
        uint256 newTokenId1 = newTokenIds[0];
        uint256 newTokenId2 = newTokenIds[1];
        
        // Check stake amounts
        IStakeNFT.StakeInfo memory stakeInfo1 = stakeNFT.getStakeInfo(newTokenId1);
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(newTokenId2);
        assertEq(stakeInfo1.stakedAmount, 10 * 10**6);
        assertEq(stakeInfo2.stakedAmount, STAKE_AMOUNT - (10 * 10**6));
    }
    
    /**
     * @dev Test splitting with almost full amount
     */
    function testSplitAlmostFullAmount() public {
        // Try to split with almost full amount
        vm.prank(user1);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = STAKE_AMOUNT - (10 * 10**6); // All but $10
        amounts[1] = 10 * 10**6; // $10
        uint256[] memory newTokenIds = stakeNFT.splitStake(tokenId, amounts);
        uint256 newTokenId1 = newTokenIds[0];
        uint256 newTokenId2 = newTokenIds[1];
        
        // Check stake amounts
        IStakeNFT.StakeInfo memory stakeInfo1 = stakeNFT.getStakeInfo(newTokenId1);
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(newTokenId2);
        assertEq(stakeInfo1.stakedAmount, STAKE_AMOUNT - (10 * 10**6));
        assertEq(stakeInfo2.stakedAmount, 10 * 10**6);
    }
    
    /**
     * @dev Test getting all tokens after splitting
     */
    function testGetTokensAfterSplit() public {
        // Split the token
        vm.prank(user1);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = SPLIT_AMOUNT_1;
        amounts[1] = SPLIT_AMOUNT_2;
        stakeNFT.splitStake(tokenId, amounts);
        
        // Get tokens for user1
        uint256[] memory tokens = stakeNFT.getTokensByOwner(user1);
        
        // Check token count
        assertEq(tokens.length, 2);
    }
}
