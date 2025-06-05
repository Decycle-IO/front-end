// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title StakeNFTRewardsTest
 * @dev Tests for StakeNFT rewards functionality
 */
contract StakeNFTRewardsTest is BaseTest {
    // Test constants
    uint256 constant STAKE_AMOUNT = 1000 * 10**6; // 1,000 USDC
    uint256 constant REWARD_AMOUNT = 100 * 10**6; // 100 USDC
    
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
     * @dev Test adding rewards
     */
    function testAddRewards() public {
        // Add rewards
        vm.prank(owner);
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT);
        
        // Check pending rewards
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(tokenId);
        assertEq(stakeInfo.accumulatedRewards, REWARD_AMOUNT);
    }
    
    /**
     * @dev Test adding rewards by non-owner
     */
    function testAddRewardsByNonOwner() public {
        // Try to add rewards as non-owner
        vm.prank(user1);
        vm.expectRevert();
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT);
    }
    
    /**
     * @dev Test adding rewards to non-existent token
     */
    function testAddRewardsToNonExistentToken() public {
        vm.prank(owner);
        vm.expectRevert();
        stakeNFT.addRewards(999, REWARD_AMOUNT);
    }
    
    /**
     * @dev Test adding zero rewards
     */
    function testAddZeroRewards() public {
        // Add zero rewards
        vm.prank(owner);
        stakeNFT.addRewards(tokenId, 0);
        
        // Check pending rewards
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(tokenId);
        assertEq(stakeInfo.accumulatedRewards, 0);
    }
    
    /**
     * @dev Test adding rewards multiple times
     */
    function testAddRewardsMultipleTimes() public {
        // Add rewards multiple times
        vm.startPrank(owner);
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT);
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT * 2);
        vm.stopPrank();
        
        // Check pending rewards
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(tokenId);
        assertEq(stakeInfo.accumulatedRewards, REWARD_AMOUNT * 3);
    }
    
    /**
     * @dev Test claiming rewards
     */
    function testClaimRewards() public {
        // Add rewards
        vm.prank(owner);
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT);
        
        // Mint TRASH tokens to StakeNFT contract
        vm.prank(owner);
        trashToken.mint(address(stakeNFT), REWARD_AMOUNT);
        
        // Check initial balance
        uint256 initialBalance = trashToken.balanceOf(user1);
        
        // Claim rewards
        vm.prank(user1);
        stakeNFT.claimRewards(tokenId);
        
        // Check balance after claiming
        uint256 finalBalance = trashToken.balanceOf(user1);
        assertEq(finalBalance - initialBalance, REWARD_AMOUNT);
        
        // Check pending rewards
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(tokenId);
        assertEq(stakeInfo2.accumulatedRewards, 0);
    }
    
    /**
     * @dev Test claiming rewards by non-owner
     */
    function testClaimRewardsByNonOwner() public {
        // Add rewards
        vm.prank(owner);
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT);
        
        // Try to claim rewards as non-owner
        vm.prank(user2);
        vm.expectRevert();
        stakeNFT.claimRewards(tokenId);
    }
    
    /**
     * @dev Test claiming rewards from non-existent token
     */
    function testClaimRewardsFromNonExistentToken() public {
        vm.prank(user1);
        vm.expectRevert();
        stakeNFT.claimRewards(999);
    }
    
    /**
     * @dev Test claiming zero rewards
     */
    function testClaimZeroRewards() public {
        // Check initial balance
        uint256 initialBalance = trashToken.balanceOf(user1);
        
        // Claim rewards should revert with NoRewardsToClaim
        vm.prank(user1);
        vm.expectRevert("NoRewardsToClaim()");
        stakeNFT.claimRewards(tokenId);
        
        // Check balance after claiming
        uint256 finalBalance = trashToken.balanceOf(user1);
        assertEq(finalBalance, initialBalance);
    }
    
    /**
     * @dev Test claiming rewards when paused
     */
    function testClaimRewardsWhenPaused() public {
        // Add rewards
        vm.prank(owner);
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT);
        
        // Mint TRASH tokens to StakeNFT contract
        vm.prank(owner);
        trashToken.mint(address(stakeNFT), REWARD_AMOUNT);
        
        // Pause the contract
        vm.prank(owner);
        stakeNFT.pause();
        
        // Try to claim rewards when paused
        vm.prank(user1);
        vm.expectRevert();
        stakeNFT.claimRewards(tokenId);
        
        // Unpause
        vm.prank(owner);
        stakeNFT.unpause();
        
        // Should work now
        vm.prank(user1);
        stakeNFT.claimRewards(tokenId);
    }
    
    /**
     * @dev Test rewards after token transfer
     */
    function testRewardsAfterTransfer() public {
        // Add rewards
        vm.prank(owner);
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT);
        
        // Mint TRASH tokens to StakeNFT contract
        vm.prank(owner);
        trashToken.mint(address(stakeNFT), REWARD_AMOUNT);
        
        // Transfer token
        vm.prank(user1);
        stakeNFT.transferFrom(user1, user2, tokenId);
        
        // Check pending rewards
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(tokenId);
        assertEq(stakeInfo.accumulatedRewards, REWARD_AMOUNT);
        
        // Claim rewards as new owner
        vm.prank(user2);
        stakeNFT.claimRewards(tokenId);
        
        // Check balance
        assertEq(trashToken.balanceOf(user2), REWARD_AMOUNT);
    }
    
    /**
     * @dev Test rewards after splitting
     */
    function testRewardsAfterSplit() public {
        // Add rewards
        vm.prank(owner);
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT);
        
        // Mint TRASH tokens to StakeNFT contract
        vm.prank(owner);
        trashToken.mint(address(stakeNFT), REWARD_AMOUNT);
        
        // Split token
        vm.prank(user1);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = STAKE_AMOUNT / 2;
        amounts[1] = STAKE_AMOUNT / 2;
        uint256[] memory newTokenIds = stakeNFT.splitStake(tokenId, amounts);
        uint256 newTokenId1 = newTokenIds[0];
        uint256 newTokenId2 = newTokenIds[1];
        
        // Check pending rewards
        IStakeNFT.StakeInfo memory stakeInfo1 = stakeNFT.getStakeInfo(newTokenId1);
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(newTokenId2);
        assertEq(stakeInfo1.accumulatedRewards, REWARD_AMOUNT / 2);
        assertEq(stakeInfo2.accumulatedRewards, REWARD_AMOUNT / 2);
        
        // Claim rewards
        vm.startPrank(user1);
        stakeNFT.claimRewards(newTokenId1);
        stakeNFT.claimRewards(newTokenId2);
        vm.stopPrank();
        
        // Check balance
        assertEq(trashToken.balanceOf(user1), REWARD_AMOUNT);
    }
    
    /**
     * @dev Test rewards after merging
     */
    function testRewardsAfterMerge() public {
        // Mint another token
        vm.prank(owner);
        uint256 tokenId2 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT, 10000);
        
        // Add rewards
        vm.startPrank(owner);
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT);
        stakeNFT.addRewards(tokenId2, REWARD_AMOUNT * 2);
        vm.stopPrank();
        
        // Mint TRASH tokens to StakeNFT contract
        vm.prank(owner);
        trashToken.mint(address(stakeNFT), REWARD_AMOUNT * 3);
        
        // Merge tokens
        vm.prank(user1);
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId;
        tokenIds[1] = tokenId2;
        uint256 newTokenId = stakeNFT.mergeStakes(tokenIds);
        
        // Check pending rewards
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(newTokenId);
        assertEq(stakeInfo.accumulatedRewards, REWARD_AMOUNT * 3);
        
        // Claim rewards
        vm.prank(user1);
        stakeNFT.claimRewards(newTokenId);
        
        // Check balance
        assertEq(trashToken.balanceOf(user1), REWARD_AMOUNT * 3);
    }
    
    /**
     * @dev Test adding maximum rewards
     */
    function testAddMaximumRewards() public {
        // Add maximum rewards
        uint256 maxRewards = type(uint256).max;
        
        vm.prank(owner);
        stakeNFT.addRewards(tokenId, maxRewards);
        
        // Check pending rewards
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(tokenId);
        assertEq(stakeInfo.accumulatedRewards, maxRewards);
    }
    
    /**
     * @dev Test rewards overflow
     */
    function testRewardsOverflow() public {
        // Add maximum rewards
        uint256 maxRewards = type(uint256).max;
        
        vm.startPrank(owner);
        stakeNFT.addRewards(tokenId, maxRewards);
        
        // This should revert due to overflow
        vm.expectRevert();
        stakeNFT.addRewards(tokenId, 1);
        vm.stopPrank();
    }
    
    /**
     * @dev Test claiming multiple rewards
     */
    function testClaimMultipleRewards() public {
        // Mint multiple tokens
        vm.startPrank(owner);
        uint256 tokenId2 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT, 10000);
        uint256 tokenId3 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT, 10000);
        vm.stopPrank();
        
        // Add rewards
        vm.startPrank(owner);
        stakeNFT.addRewards(tokenId, REWARD_AMOUNT);
        stakeNFT.addRewards(tokenId2, REWARD_AMOUNT * 2);
        stakeNFT.addRewards(tokenId3, REWARD_AMOUNT * 3);
        vm.stopPrank();
        
        // Mint TRASH tokens to StakeNFT contract
        vm.prank(owner);
        trashToken.mint(address(stakeNFT), REWARD_AMOUNT * 6);
        
        // Check initial balance
        uint256 initialBalance = trashToken.balanceOf(user1);
        
        // Claim rewards individually
        vm.startPrank(user1);
        stakeNFT.claimRewards(tokenId);
        stakeNFT.claimRewards(tokenId2);
        stakeNFT.claimRewards(tokenId3);
        vm.stopPrank();
        
        // Check balance after claiming
        uint256 finalBalance = trashToken.balanceOf(user1);
        assertEq(finalBalance - initialBalance, REWARD_AMOUNT * 6);
        
        // Check pending rewards
        IStakeNFT.StakeInfo memory stakeInfo1 = stakeNFT.getStakeInfo(tokenId);
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(tokenId2);
        IStakeNFT.StakeInfo memory stakeInfo3 = stakeNFT.getStakeInfo(tokenId3);
        assertEq(stakeInfo1.accumulatedRewards, 0);
        assertEq(stakeInfo2.accumulatedRewards, 0);
        assertEq(stakeInfo3.accumulatedRewards, 0);
    }
}
