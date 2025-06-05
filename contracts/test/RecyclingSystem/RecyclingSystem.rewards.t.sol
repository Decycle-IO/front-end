// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";
import "../utils/TestHelpers.sol";

/**
 * @title RecyclingSystemRewardsTest
 * @dev Tests for RecyclingSystem rewards functionality
 */
contract RecyclingSystemRewardsTest is BaseTest {
    // Test constants
    string constant LOCATION = "Test Location";
    uint256 constant TARGET_AMOUNT = 1000 * 10**6; // 1,000 USDC
    uint256 constant STAKE_AMOUNT_1 = 250 * 10**6; // 250 USDC (25%)
    uint256 constant STAKE_AMOUNT_2 = 500 * 10**6; // 500 USDC (50%)
    uint256 constant STAKE_AMOUNT_3 = 250 * 10**6; // 250 USDC (25%)
    uint256 constant RECYCLED_AMOUNT = 100 * 10**6; // 100 USDC
    
    // Test variables
    uint256 pendingGarbageCanId;
    uint256 garbageCanId;
    uint256 stakeId1;
    uint256 stakeId2;
    uint256 stakeId3;
    
    function setUp() public override {
        super.setUp();
        
        // Deploy full system
        deployFullSystem();
        
        // Authorize deployer and updater
        if (!recyclingSystem.isAuthorizedDeployer(deployer)) {
            recyclingSystem.authorizeDeployer(deployer);
        }
        if (!recyclingSystem.isAuthorizedUpdater(updater)) {
            recyclingSystem.authorizeUpdater(updater);
        }
        
        // Approve USDC for staking
        vm.startPrank(user1);
        usdcToken.approve(address(recyclingSystem), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(user2);
        usdcToken.approve(address(recyclingSystem), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(user3);
        usdcToken.approve(address(recyclingSystem), type(uint256).max);
        vm.stopPrank();
        
        // Create a pending garbage can
        pendingGarbageCanId = recyclingSystem.createPendingGarbageCan(LOCATION, TARGET_AMOUNT);
        
        // Create stakes for the pending garbage can
        vm.prank(user1);
        recyclingSystem.depositStake(pendingGarbageCanId, STAKE_AMOUNT_1);
        
        vm.prank(user2);
        recyclingSystem.depositStake(pendingGarbageCanId, STAKE_AMOUNT_2);
        
        vm.prank(user3);
        recyclingSystem.depositStake(pendingGarbageCanId, STAKE_AMOUNT_3);
        
        // Get the stake IDs from the pending garbage can
        uint256[] memory stakeIds = stakeNFT.getTokensByGarbageCan(pendingGarbageCanId);
        stakeId1 = stakeIds[0]; // user1's stake
        stakeId2 = stakeIds[1]; // user2's stake
        stakeId3 = stakeIds[2]; // user3's stake
        
        // Deploy the garbage can
        vm.prank(deployer);
        garbageCanId = recyclingSystem.deployGarbageCan(pendingGarbageCanId);
    }
    
    /**
     * @dev Test reward distribution
     */
    function testRewardDistribution() public {
        // Get the purchase percentage (50% by default)
        uint256 purchasePercentage = recyclingSystem.getPurchasePercentage();
        
        // Calculate the actual purchase amount (50% of the recycled amount by default)
        uint256 purchaseAmount = (RECYCLED_AMOUNT * purchasePercentage) / 10000;
        
        // Mint TRASH tokens to the RecyclingSystem contract for rewards
        vm.prank(owner);
        trashToken.mint(address(recyclingSystem), purchaseAmount);
        
        // Update garbage can with recycled amount
        vm.prank(updater);
        recyclingSystem.updateFillLevel(garbageCanId, IRecyclingSystem.RecyclableType.PLASTIC, 100, RECYCLED_AMOUNT);
        
        // Setup a collector to buy the contents
        address collector = makeAddr("collector");
        usdcToken.mint(collector, RECYCLED_AMOUNT);
        
        vm.startPrank(collector);
        usdcToken.approve(address(recyclingSystem), RECYCLED_AMOUNT);
        
        // Buy the contents to trigger reward distribution
        recyclingSystem.buyContents(garbageCanId);
        vm.stopPrank();
        
        // Check rewards - should be proportional to stake percentages of the purchase amount
        uint256 expectedReward1 = purchaseAmount / 4; // 25% of purchase amount
        uint256 expectedReward2 = purchaseAmount / 2; // 50% of purchase amount
        uint256 expectedReward3 = purchaseAmount / 4; // 25% of purchase amount
        
        assertEq(stakeNFT.getStakeInfo(stakeId1).accumulatedRewards, expectedReward1);
        assertEq(stakeNFT.getStakeInfo(stakeId2).accumulatedRewards, expectedReward2);
        assertEq(stakeNFT.getStakeInfo(stakeId3).accumulatedRewards, expectedReward3);
        
        // Check total rewards - should equal the purchase amount
        assertEq(expectedReward1 + expectedReward2 + expectedReward3, purchaseAmount);
    }
    
    /**
     * @dev Test claiming rewards
     */
    function testClaimRewards() public {
        // Get the purchase percentage (50% by default)
        uint256 purchasePercentage = recyclingSystem.getPurchasePercentage();
        
        // Calculate the actual purchase amount (50% of the recycled amount by default)
        uint256 purchaseAmount = (RECYCLED_AMOUNT * purchasePercentage) / 10000;
        
        // Mint TRASH tokens to the RecyclingSystem contract for rewards
        vm.prank(owner);
        trashToken.mint(address(recyclingSystem), purchaseAmount);
        
        // Update garbage can with recycled amount
        vm.prank(updater);
        recyclingSystem.updateFillLevel(garbageCanId, IRecyclingSystem.RecyclableType.PLASTIC, 100, RECYCLED_AMOUNT);
        
        // Setup a collector to buy the contents
        address collector = makeAddr("collector");
        usdcToken.mint(collector, RECYCLED_AMOUNT);
        
        vm.startPrank(collector);
        usdcToken.approve(address(recyclingSystem), RECYCLED_AMOUNT);
        
        // Buy the contents to trigger reward distribution
        recyclingSystem.buyContents(garbageCanId);
        vm.stopPrank();
        
        // Get expected rewards
        uint256 expectedReward1 = purchaseAmount / 4; // 25% of purchase amount
        
        // Check initial balances
        uint256 initialTrashBalance = trashToken.balanceOf(user1);
        
        // Claim rewards
        vm.prank(user1);
        stakeNFT.claimRewards(stakeId1);
        
        // Check balances after claiming
        uint256 finalTrashBalance = trashToken.balanceOf(user1);
        
        assertEq(finalTrashBalance - initialTrashBalance, expectedReward1);
        
        // Check pending rewards are now zero
        assertEq(stakeNFT.getStakeInfo(stakeId1).accumulatedRewards, 0);
    }
    
    /**
     * @dev Test claiming rewards by non-owner
     */
    function testClaimRewardsByNonOwner() public {
        // Get the purchase percentage (50% by default)
        uint256 purchasePercentage = recyclingSystem.getPurchasePercentage();
        
        // Calculate the actual purchase amount (50% of the recycled amount by default)
        uint256 purchaseAmount = (RECYCLED_AMOUNT * purchasePercentage) / 10000;
        
        // Mint TRASH tokens to the RecyclingSystem contract for rewards
        vm.prank(owner);
        trashToken.mint(address(recyclingSystem), purchaseAmount);
        
        // Update garbage can with recycled amount
        vm.prank(updater);
        recyclingSystem.updateFillLevel(garbageCanId, IRecyclingSystem.RecyclableType.PLASTIC, 100, RECYCLED_AMOUNT);
        
        // Setup a collector to buy the contents
        address collector = makeAddr("collector");
        usdcToken.mint(collector, RECYCLED_AMOUNT);
        
        vm.startPrank(collector);
        usdcToken.approve(address(recyclingSystem), RECYCLED_AMOUNT);
        
        // Buy the contents to trigger reward distribution
        recyclingSystem.buyContents(garbageCanId);
        vm.stopPrank();
        
        // Try to claim rewards as non-owner
        vm.prank(user2);
        vm.expectRevert();
        stakeNFT.claimRewards(stakeId1);
    }
    
    /**
     * @dev Test multiple reward distributions
     */
    function testMultipleRewardDistributions() public {
        // Get the purchase percentage (50% by default)
        uint256 purchasePercentage = recyclingSystem.getPurchasePercentage();
        
        // Calculate the total purchase amount for all updates
        uint256 totalPurchaseAmount = (RECYCLED_AMOUNT * purchasePercentage) / 10000 + 
                                     (RECYCLED_AMOUNT * 2 * purchasePercentage) / 10000;
        
        // Mint TRASH tokens to the RecyclingSystem contract for rewards
        vm.prank(owner);
        trashToken.mint(address(recyclingSystem), totalPurchaseAmount);
        
        // First update
        vm.prank(updater);
        recyclingSystem.updateFillLevel(garbageCanId, IRecyclingSystem.RecyclableType.PLASTIC, 100, RECYCLED_AMOUNT);
        
        // Setup a collector to buy the contents after first update
        address collector = makeAddr("collector");
        usdcToken.mint(collector, RECYCLED_AMOUNT * 3);
        
        vm.startPrank(collector);
        usdcToken.approve(address(recyclingSystem), RECYCLED_AMOUNT * 3);
        
        // Buy the contents to trigger first reward distribution
        recyclingSystem.buyContents(garbageCanId);
        vm.stopPrank();
        
        // Second update
        vm.prank(updater);
        recyclingSystem.updateFillLevel(garbageCanId, IRecyclingSystem.RecyclableType.METAL, 200, RECYCLED_AMOUNT * 2);
        
        // Buy the contents again to trigger second reward distribution
        vm.startPrank(collector);
        recyclingSystem.buyContents(garbageCanId);
        vm.stopPrank();
        
        // Calculate total recycled and purchased amounts
        uint256 totalRecycled = RECYCLED_AMOUNT + RECYCLED_AMOUNT * 2;
        uint256 totalPurchased = (RECYCLED_AMOUNT * purchasePercentage) / 10000 + 
                                (RECYCLED_AMOUNT * 2 * purchasePercentage) / 10000;
        
        // Check rewards - should be proportional to stake percentages of the total purchased amount
        uint256 expectedReward1 = totalPurchased / 4; // 25% of total purchased
        uint256 expectedReward2 = totalPurchased / 2; // 50% of total purchased
        uint256 expectedReward3 = totalPurchased / 4; // 25% of total purchased
        
        assertEq(stakeNFT.getStakeInfo(stakeId1).accumulatedRewards, expectedReward1);
        assertEq(stakeNFT.getStakeInfo(stakeId2).accumulatedRewards, expectedReward2);
        assertEq(stakeNFT.getStakeInfo(stakeId3).accumulatedRewards, expectedReward3);
        
        // Check total rewards - should equal the total purchased amount
        assertEq(expectedReward1 + expectedReward2 + expectedReward3, totalPurchased);
    }
    
    /**
     * @dev Test reward distribution with zero recycled amount
     */
    function testRewardDistributionZeroRecycledAmount() public {
        // Update garbage can with zero recycled amount
        vm.prank(updater);
        recyclingSystem.updateFillLevel(garbageCanId, IRecyclingSystem.RecyclableType.PLASTIC, 0, 0);
        
        // Check rewards
        assertEq(stakeNFT.getStakeInfo(stakeId1).accumulatedRewards, 0);
        assertEq(stakeNFT.getStakeInfo(stakeId2).accumulatedRewards, 0);
        assertEq(stakeNFT.getStakeInfo(stakeId3).accumulatedRewards, 0);
    }
    
    /**
     * @dev Test reward distribution with uneven amounts
     */
    function testRewardDistributionUnevenAmounts() public {
        // Get the purchase percentage (50% by default)
        uint256 purchasePercentage = recyclingSystem.getPurchasePercentage();
        
        // Create a new garbage can with uneven target amount
        uint256 pendingGarbageCanId2 = recyclingSystem.createPendingGarbageCan("Location 2", 999 * 10**6); // 999 USDC
        
        // Create stakes with uneven amounts
        vm.prank(user1);
        uint256 stakeId4 = recyclingSystem.depositStake(pendingGarbageCanId2, 333 * 10**6); // 333 USDC (33.33%)
        
        vm.prank(user2);
        uint256 stakeId5 = recyclingSystem.depositStake(pendingGarbageCanId2, 333 * 10**6); // 333 USDC (33.33%)
        
        vm.prank(user3);
        uint256 stakeId6 = recyclingSystem.depositStake(pendingGarbageCanId2, 333 * 10**6); // 333 USDC (33.33%)
        
        // Deploy the garbage can
        vm.prank(deployer);
        uint256 garbageCanId2 = recyclingSystem.deployGarbageCan(pendingGarbageCanId2);
        
        // Calculate the actual purchase amount (50% of the recycled amount by default)
        uint256 purchaseAmount = (RECYCLED_AMOUNT * purchasePercentage) / 10000;
        
        // Mint TRASH tokens to the RecyclingSystem contract for rewards
        vm.prank(owner);
        trashToken.mint(address(recyclingSystem), purchaseAmount);
        
        // Update garbage can with recycled amount
        vm.prank(updater);
        recyclingSystem.updateFillLevel(garbageCanId2, IRecyclingSystem.RecyclableType.PLASTIC, 100, RECYCLED_AMOUNT);
        
        // Setup a collector to buy the contents
        address collector = makeAddr("collector");
        usdcToken.mint(collector, RECYCLED_AMOUNT);
        
        vm.startPrank(collector);
        usdcToken.approve(address(recyclingSystem), RECYCLED_AMOUNT);
        
        // Buy the contents to trigger reward distribution
        recyclingSystem.buyContents(garbageCanId2);
        vm.stopPrank();
        
        // Check rewards (should be approximately equal)
        uint256 reward4 = stakeNFT.getStakeInfo(stakeId4).accumulatedRewards;
        uint256 reward5 = stakeNFT.getStakeInfo(stakeId5).accumulatedRewards;
        uint256 reward6 = stakeNFT.getStakeInfo(stakeId6).accumulatedRewards;
        
        // Each should get approximately 1/3 of the rewards (purchase amount is distributed)
        assertApproxEqRel(reward4, purchaseAmount / 3, 0.01e18); // 1% tolerance
        assertApproxEqRel(reward5, purchaseAmount / 3, 0.01e18);
        assertApproxEqRel(reward6, purchaseAmount / 3, 0.01e18);
        
        // Total should be approximately equal to purchase amount (allow for rounding errors)
        assertApproxEqAbs(reward4 + reward5 + reward6, purchaseAmount, 2); // Allow for rounding errors up to 2 wei
    }
    
    /**
     * @dev Test reward distribution with new stake after update
     */
    function testRewardDistributionWithNewStake() public {
        // Get the purchase percentage (50% by default)
        uint256 purchasePercentage = recyclingSystem.getPurchasePercentage();
        
        // Calculate the total purchase amount for both updates
        uint256 totalPurchaseAmount = (RECYCLED_AMOUNT * purchasePercentage) / 10000 * 2;
        
        // Mint TRASH tokens to the RecyclingSystem contract for rewards
        vm.prank(owner);
        trashToken.mint(address(recyclingSystem), totalPurchaseAmount);
        
        // Update garbage can with recycled amount
        vm.prank(updater);
        recyclingSystem.updateFillLevel(garbageCanId, IRecyclingSystem.RecyclableType.PLASTIC, 100, RECYCLED_AMOUNT);
        
        // Setup a collector to buy the contents
        address collector = makeAddr("collector");
        usdcToken.mint(collector, RECYCLED_AMOUNT * 2);
        
        vm.startPrank(collector);
        usdcToken.approve(address(recyclingSystem), RECYCLED_AMOUNT * 2);
        
        // Buy the contents to trigger first reward distribution
        recyclingSystem.buyContents(garbageCanId);
        vm.stopPrank();
        
        // Create a new pending garbage can for the new stake
        uint256 pendingGarbageCanId3 = recyclingSystem.createPendingGarbageCan("Location 3", TARGET_AMOUNT);
        
        // Create a new stake
        address user4 = makeAddr("user4");
        usdcToken.mint(user4, INITIAL_BALANCE);
        
        vm.startPrank(user4);
        usdcToken.approve(address(recyclingSystem), type(uint256).max);
        uint256 stakeId4 = recyclingSystem.depositStake(pendingGarbageCanId3, TARGET_AMOUNT);
        vm.stopPrank();
        
        // Deploy the garbage can
        vm.prank(deployer);
        uint256 garbageCanId3 = recyclingSystem.deployGarbageCan(pendingGarbageCanId3);
        
        // Update original garbage can again
        vm.prank(updater);
        recyclingSystem.updateFillLevel(garbageCanId, IRecyclingSystem.RecyclableType.METAL, 100, RECYCLED_AMOUNT);
        
        // Buy the contents again to trigger second reward distribution
        vm.startPrank(collector);
        recyclingSystem.buyContents(garbageCanId);
        vm.stopPrank();
        
        // Calculate purchase amounts for each update
        uint256 purchaseAmount1 = (RECYCLED_AMOUNT * purchasePercentage) / 10000;
        uint256 purchaseAmount2 = (RECYCLED_AMOUNT * purchasePercentage) / 10000;
        uint256 totalPurchased = purchaseAmount1 + purchaseAmount2;
        
        // Check rewards for original stakes (should include both updates)
        uint256 expectedReward1 = totalPurchased / 4; // 25% of total purchased amount
        
        assertEq(stakeNFT.getStakeInfo(stakeId1).accumulatedRewards, expectedReward1);
        
        // New stake is for a different garbage can, so it shouldn't have any rewards yet
        assertEq(stakeNFT.getStakeInfo(stakeId4).accumulatedRewards, 0);
    }
}
