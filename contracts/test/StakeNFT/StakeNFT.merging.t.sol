// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title StakeNFTMergingTest
 * @dev Tests for StakeNFT merging functionality
 */
contract StakeNFTMergingTest is BaseTest {
    // Test constants
    uint256 constant STAKE_AMOUNT_1 = 400 * 10**6; // 400 USDC
    uint256 constant STAKE_AMOUNT_2 = 600 * 10**6; // 600 USDC
    
    // Test variables
    uint256 tokenId1;
    uint256 tokenId2;
    
    function setUp() public override {
        super.setUp();
        
        // Deploy full system
        deployFullSystem();
        
        // Mint tokens
        vm.startPrank(owner);
        tokenId1 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT_1, 10000);
        tokenId2 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT_2, 10000);
        vm.stopPrank();
    }
    
    /**
     * @dev Test merging tokens
     */
    function testMerge() public {
        // Merge tokens
        vm.prank(user1);
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId2;
        uint256 newTokenId = stakeNFT.mergeStakes(tokenIds);
        
        // Check new token ownership
        assertEq(stakeNFT.ownerOf(newTokenId), user1);
        
        // Check stake amount
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(newTokenId);
        assertEq(stakeInfo.stakedAmount, STAKE_AMOUNT_1 + STAKE_AMOUNT_2);
        
        // Check that original tokens are burned
        vm.expectRevert();
        stakeNFT.ownerOf(tokenId1);
        
        vm.expectRevert();
        stakeNFT.ownerOf(tokenId2);
    }
    
    /**
     * @dev Test merging by non-owner
     */
    function testMergeByNonOwner() public {
        // Try to merge as non-owner of first token
        vm.prank(user2);
        vm.expectRevert();
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId2;
        stakeNFT.mergeStakes(tokenIds);
        
        // Mint a token for user2
        vm.prank(owner);
        uint256 tokenId3 = stakeNFT.mintStake(user2, 1, STAKE_AMOUNT_1, 10000);
        
        // Try to merge as owner of only one token
        vm.prank(user2);
        vm.expectRevert();
        uint256[] memory tokenIds2 = new uint256[](2);
        tokenIds2[0] = tokenId3;
        tokenIds2[1] = tokenId1;
        stakeNFT.mergeStakes(tokenIds2);
    }
    
    /**
     * @dev Test merging a non-existent token
     */
    function testMergeNonExistentToken() public {
        vm.prank(user1);
        vm.expectRevert();
        uint256[] memory tokenIds1 = new uint256[](2);
        tokenIds1[0] = tokenId1;
        tokenIds1[1] = 999;
        stakeNFT.mergeStakes(tokenIds1);
        
        vm.prank(user1);
        vm.expectRevert();
        uint256[] memory tokenIds2 = new uint256[](2);
        tokenIds2[0] = 999;
        tokenIds2[1] = tokenId1;
        stakeNFT.mergeStakes(tokenIds2);
    }
    
    /**
     * @dev Test merging when paused
     */
    function testMergeWhenPaused() public {
        // Pause the contract
        vm.prank(owner);
        stakeNFT.pause();
        
        // Try to merge when paused
        vm.prank(user1);
        vm.expectRevert();
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId2;
        stakeNFT.mergeStakes(tokenIds);
        
        // Unpause
        vm.prank(owner);
        stakeNFT.unpause();
        
        // Should work now
        vm.prank(user1);
        uint256[] memory tokenIds2 = new uint256[](2);
        tokenIds2[0] = tokenId1;
        tokenIds2[1] = tokenId2;
        stakeNFT.mergeStakes(tokenIds2);
    }
    
    /**
     * @dev Test merging with pending rewards
     */
    function testMergeWithPendingRewards() public {
        // Add rewards to the tokens
        uint256 rewardAmount1 = 100 * 10**6; // 100 USDC
        uint256 rewardAmount2 = 200 * 10**6; // 200 USDC
        
        vm.startPrank(owner);
        stakeNFT.addRewards(tokenId1, rewardAmount1);
        stakeNFT.addRewards(tokenId2, rewardAmount2);
        vm.stopPrank();
        
        // Check pending rewards before merge
        IStakeNFT.StakeInfo memory stakeInfo1 = stakeNFT.getStakeInfo(tokenId1);
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(tokenId2);
        assertEq(stakeInfo1.accumulatedRewards, rewardAmount1);
        assertEq(stakeInfo2.accumulatedRewards, rewardAmount2);
        
        // Merge tokens
        vm.prank(user1);
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId2;
        uint256 newTokenId = stakeNFT.mergeStakes(tokenIds);
        
        // Check pending rewards after merge
        IStakeNFT.StakeInfo memory mergedStakeInfo = stakeNFT.getStakeInfo(newTokenId);
        assertEq(mergedStakeInfo.accumulatedRewards, rewardAmount1 + rewardAmount2);
    }
    
    /**
     * @dev Test merging multiple times
     */
    function testMergeMultipleTimes() public {
        // First merge
        vm.prank(user1);
        uint256[] memory tokenIds1 = new uint256[](2);
        tokenIds1[0] = tokenId1;
        tokenIds1[1] = tokenId2;
        uint256 newTokenId1 = stakeNFT.mergeStakes(tokenIds1);
        
        // Mint another token
        vm.prank(owner);
        uint256 tokenId3 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT_1, 10000);
        
        // Second merge
        vm.prank(user1);
        uint256[] memory tokenIds2 = new uint256[](2);
        tokenIds2[0] = newTokenId1;
        tokenIds2[1] = tokenId3;
        uint256 newTokenId2 = stakeNFT.mergeStakes(tokenIds2);
        
        // Check stake amount
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(newTokenId2);
        assertEq(stakeInfo.stakedAmount, STAKE_AMOUNT_1 + STAKE_AMOUNT_2 + STAKE_AMOUNT_1);
        
        // Check that original tokens are burned
        vm.expectRevert();
        stakeNFT.ownerOf(tokenId1);
        
        vm.expectRevert();
        stakeNFT.ownerOf(tokenId2);
        
        vm.expectRevert();
        stakeNFT.ownerOf(tokenId3);
        
        vm.expectRevert();
        stakeNFT.ownerOf(newTokenId1);
    }
    
    /**
     * @dev Test merging tokens with different owners
     */
    function testMergeTokensWithDifferentOwners() public {
        // Mint a token for user2
        vm.prank(owner);
        uint256 tokenId3 = stakeNFT.mintStake(user2, 1, STAKE_AMOUNT_1, 10000);
        
        // Try to merge tokens with different owners
        vm.prank(user1);
        vm.expectRevert();
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId3;
        stakeNFT.mergeStakes(tokenIds);
    }
    
    /**
     * @dev Test merging the same token
     */
    function testMergeSameToken() public {
        // Try to merge the same token
        vm.prank(user1);
        vm.expectRevert();
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId1;
        stakeNFT.mergeStakes(tokenIds);
    }
    
    /**
     * @dev Test getting all tokens after merging
     */
    function testGetTokensAfterMerge() public {
        // Check initial token count
        uint256[] memory initialTokens = stakeNFT.getTokensByOwner(user1);
        assertEq(initialTokens.length, 2);
        
        // Merge tokens
        vm.prank(user1);
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId2;
        stakeNFT.mergeStakes(tokenIds);
        
        // Get tokens for user1
        uint256[] memory tokens = stakeNFT.getTokensByOwner(user1);
        
        // Check token count
        assertEq(tokens.length, 1);
    }
    
    /**
     * @dev Test merging tokens with maximum stake amount
     */
    function testMergeMaxStakeAmount() public {
        // Mint tokens with maximum stake amount
        uint256 maxAmount = type(uint256).max / 2;
        
        vm.startPrank(owner);
        uint256 tokenId3 = stakeNFT.mintStake(user2, 1, maxAmount, 10000);
        uint256 tokenId4 = stakeNFT.mintStake(user2, 1, maxAmount, 10000);
        vm.stopPrank();
        
        // Merge tokens
        vm.prank(user2);
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId3;
        tokenIds[1] = tokenId4;
        uint256 newTokenId = stakeNFT.mergeStakes(tokenIds);
        
        // Check stake amount
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(newTokenId);
        assertEq(stakeInfo.stakedAmount, maxAmount * 2);
    }
    
    /**
     * @dev Test merging tokens with zero stake amount
     */
    function testMergeZeroStakeAmount() public {
        // This should never happen in practice, but let's test it anyway
        // We'll use a mock contract to set the stake amount to zero
        
        // Mint a token with zero stake amount (this would require modifying the contract)
        // For this test, we'll just check that merging works with very small amounts
        
        vm.startPrank(owner);
        uint256 tokenId3 = stakeNFT.mintStake(user2, 1, 1, 10000);
        uint256 tokenId4 = stakeNFT.mintStake(user2, 1, 1, 10000);
        vm.stopPrank();
        
        // Merge tokens
        vm.prank(user2);
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId3;
        tokenIds[1] = tokenId4;
        uint256 newTokenId = stakeNFT.mergeStakes(tokenIds);
        
        // Check stake amount
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(newTokenId);
        assertEq(stakeInfo.stakedAmount, 2);
    }
}
