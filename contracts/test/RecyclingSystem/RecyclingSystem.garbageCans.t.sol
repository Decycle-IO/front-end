// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";
import "../utils/TestHelpers.sol";

/**
 * @title RecyclingSystemGarbageCansTest
 * @dev Tests for RecyclingSystem garbage can functionality
 */
contract RecyclingSystemGarbageCansTest is BaseTest {
    // Test constants
    string constant LOCATION = "Test Location";
    uint256 constant TARGET_AMOUNT = 1000 * 10**6; // 1,000 USDC
    
    function setUp() public override {
        super.setUp();
        
        // Deploy full system
        deployFullSystem();
        
        // Note: deployer is already authorized in deployFullSystem()
        
        // Approve USDC for staking
        vm.startPrank(user1);
        usdcToken.approve(address(recyclingSystem), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(user2);
        usdcToken.approve(address(recyclingSystem), type(uint256).max);
        vm.stopPrank();
    }
    
    /**
     * @dev Test creating a pending garbage can
     */
    function testCreatePendingGarbageCan() public {
        // Create pending garbage can
        uint256 pendingGarbageCanId = recyclingSystem.createPendingGarbageCan(LOCATION, TARGET_AMOUNT);
        
        // Check pending garbage can
        (string memory location, uint256 targetAmount, uint256 currentAmount, bool isDeployed) = recyclingSystem.getPendingGarbageCanInfo(pendingGarbageCanId);
        
        assertEq(location, LOCATION);
        assertEq(targetAmount, TARGET_AMOUNT);
        assertEq(currentAmount, 0);
        assertFalse(isDeployed);
        
        // Check system stats
        (
            uint256 totalGarbageCans,
            uint256 totalPendingGarbageCans,
            uint256 totalActiveGarbageCans,
            ,
            ,
            
        ) = recyclingSystem.getSystemStats();
        
        assertEq(totalGarbageCans, 0);
        assertEq(totalPendingGarbageCans, 1);
        assertEq(totalActiveGarbageCans, 0);
    }
    
    /**
     * @dev Test creating a pending garbage can with zero target amount
     */
    function testCreatePendingGarbageCanZeroTargetAmount() public {
        vm.expectRevert();
        recyclingSystem.createPendingGarbageCan(LOCATION, 0);
    }
    
    /**
     * @dev Test creating a pending garbage can with empty location
     */
    function testCreatePendingGarbageCanEmptyLocation() public {
        vm.expectRevert();
        recyclingSystem.createPendingGarbageCan("", TARGET_AMOUNT);
    }
    
    /**
     * @dev Test deploying a garbage can
     */
    function testDeployGarbageCan() public {
        // Create pending garbage can
        uint256 pendingGarbageCanId = recyclingSystem.createPendingGarbageCan(LOCATION, TARGET_AMOUNT);
        
        // Stake USDC for the pending garbage can
        vm.startPrank(user1);
        recyclingSystem.depositStake(pendingGarbageCanId, TARGET_AMOUNT);
        vm.stopPrank();
        
        // Deploy garbage can
        vm.prank(deployer);
        uint256 garbageCanId = recyclingSystem.deployGarbageCan(pendingGarbageCanId);
        
        // Check garbage can
        (string memory location, uint256 currentValue, bool isActive, bool isLocked, uint256 deploymentTimestamp, uint256 lastEmptiedTimestamp, uint256 totalStaked) = recyclingSystem.getGarbageCanInfo(garbageCanId);
        
        assertEq(location, LOCATION);
        assertEq(currentValue, 0);
        assertTrue(isActive);
        assertFalse(isLocked);
        assertEq(totalStaked, TARGET_AMOUNT);
        
        // Check pending garbage can is now deployed
        (, , , bool isDeployed) = recyclingSystem.getPendingGarbageCanInfo(pendingGarbageCanId);
        assertTrue(isDeployed);
        
        // Check system stats
        (
            uint256 totalGarbageCans,
            uint256 totalPendingGarbageCans,
            uint256 totalActiveGarbageCans,
            ,
            ,
            
        ) = recyclingSystem.getSystemStats();
        
        assertEq(totalGarbageCans, 1);
        // Once a garbage can is deployed, it's no longer counted as "pending" in the stats
        assertEq(totalPendingGarbageCans, 0);
        assertEq(totalActiveGarbageCans, 1);
    }
    
    /**
     * @dev Test deploying a garbage can by non-deployer
     */
    function testDeployGarbageCanByNonDeployer() public {
        // Create pending garbage can
        uint256 pendingGarbageCanId = recyclingSystem.createPendingGarbageCan(LOCATION, TARGET_AMOUNT);
        
        // Try to deploy garbage can as non-deployer
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.deployGarbageCan(pendingGarbageCanId);
    }
    
    /**
     * @dev Test deploying a non-existent garbage can
     */
    function testDeployNonExistentGarbageCan() public {
        vm.prank(deployer);
        vm.expectRevert();
        recyclingSystem.deployGarbageCan(999);
    }
    
    /**
     * @dev Test deploying an already deployed garbage can
     */
    function testDeployAlreadyDeployedGarbageCan() public {
        // Create pending garbage can
        uint256 pendingGarbageCanId = recyclingSystem.createPendingGarbageCan(LOCATION, TARGET_AMOUNT);
        
        // Stake USDC for the pending garbage can
        vm.startPrank(user1);
        recyclingSystem.depositStake(pendingGarbageCanId, TARGET_AMOUNT);
        vm.stopPrank();
        
        // Deploy garbage can
        vm.prank(deployer);
        recyclingSystem.deployGarbageCan(pendingGarbageCanId);
        
        // Try to deploy again
        vm.prank(deployer);
        vm.expectRevert();
        recyclingSystem.deployGarbageCan(pendingGarbageCanId);
    }
    
    /**
     * @dev Test getting all garbage cans
     */
    function testGetAllGarbageCans() public {
        // Create and deploy multiple garbage cans
        uint256 pendingGarbageCanId1 = recyclingSystem.createPendingGarbageCan("Location 1", TARGET_AMOUNT);
        uint256 pendingGarbageCanId2 = recyclingSystem.createPendingGarbageCan("Location 2", TARGET_AMOUNT * 2);
        
        // Stake USDC for the pending garbage cans
        vm.startPrank(user1);
        recyclingSystem.depositStake(pendingGarbageCanId1, TARGET_AMOUNT);
        vm.stopPrank();
        
        vm.startPrank(user2);
        recyclingSystem.depositStake(pendingGarbageCanId2, TARGET_AMOUNT * 2);
        vm.stopPrank();
        
        vm.startPrank(deployer);
        recyclingSystem.deployGarbageCan(pendingGarbageCanId1);
        recyclingSystem.deployGarbageCan(pendingGarbageCanId2);
        vm.stopPrank();
        
        // Get all garbage cans
        uint256[] memory garbageCanIds = recyclingSystem.getAllGarbageCans(0, 10);
        
        // Check garbage can count
        assertEq(garbageCanIds.length, 2);
        
        // Check garbage can IDs
        assertEq(garbageCanIds[0], 0);
        assertEq(garbageCanIds[1], 1);
    }
    
    /**
     * @dev Test getting all pending garbage cans
     */
    function testGetAllPendingGarbageCans() public {
        // Create multiple pending garbage cans
        recyclingSystem.createPendingGarbageCan("Location 1", TARGET_AMOUNT);
        recyclingSystem.createPendingGarbageCan("Location 2", TARGET_AMOUNT * 2);
        recyclingSystem.createPendingGarbageCan("Location 3", TARGET_AMOUNT * 3);
        
        // Stake USDC for all pending garbage cans
        vm.startPrank(user1);
        recyclingSystem.depositStake(0, TARGET_AMOUNT);
        recyclingSystem.depositStake(1, TARGET_AMOUNT * 2);
        recyclingSystem.depositStake(2, TARGET_AMOUNT * 3);
        vm.stopPrank();
        
        // Deploy one garbage can
        vm.prank(deployer);
        recyclingSystem.deployGarbageCan(1);
        
        // Get all pending garbage cans
        uint256[] memory pendingGarbageCanIds = recyclingSystem.getAllPendingGarbageCans();
        
        // Check pending garbage can count - only 2 are returned because one is deployed
        assertEq(pendingGarbageCanIds.length, 2);
        
        // Check pending garbage can IDs
        assertEq(pendingGarbageCanIds[0], 0);
        assertEq(pendingGarbageCanIds[1], 2);
        
        // Get all active garbage cans
        uint256[] memory activeGarbageCanIds = recyclingSystem.getAllActiveGarbageCans();
        
        // Check active garbage can count
        assertEq(activeGarbageCanIds.length, 1);
    }
    
    /**
     * @dev Test updating a garbage can fill level
     */
    function testUpdateFillLevel() public {
        // Create and deploy a garbage can
        uint256 pendingGarbageCanId = recyclingSystem.createPendingGarbageCan(LOCATION, TARGET_AMOUNT);
        
        // Stake USDC for the pending garbage can
        vm.startPrank(user1);
        recyclingSystem.depositStake(pendingGarbageCanId, TARGET_AMOUNT);
        vm.stopPrank();
        
        vm.prank(deployer);
        uint256 garbageCanId = recyclingSystem.deployGarbageCan(pendingGarbageCanId);
        
        // Update garbage can
        uint256 recycledAmount = 100 * 10**6; // 100 USDC
        uint256 recycledWeight = 100; // 100 units of weight
        
        vm.prank(updater);
        recyclingSystem.updateFillLevel(garbageCanId, IRecyclingSystem.RecyclableType.PLASTIC, recycledWeight, recycledAmount);
        
        // Check garbage can
        (string memory location, uint256 currentValue, bool isActive, bool isLocked, uint256 deploymentTimestamp, uint256 lastEmptiedTimestamp, uint256 totalStaked) = recyclingSystem.getGarbageCanInfo(garbageCanId);
        
        assertEq(currentValue, recycledAmount);
        
        // Check system stats
        (
            ,
            ,
            ,
            ,
            uint256 systemTotalRecycled,
            uint256 systemTotalValue
        ) = recyclingSystem.getSystemStats();
        
        // systemTotalRecycled is the weight, not the value
        assertEq(systemTotalRecycled, recycledWeight);
        assertEq(systemTotalValue, recycledAmount);
    }
    
    /**
     * @dev Test updating a garbage can fill level by non-updater
     */
    function testUpdateFillLevelByNonUpdater() public {
        // Create and deploy a garbage can
        uint256 pendingGarbageCanId = recyclingSystem.createPendingGarbageCan(LOCATION, TARGET_AMOUNT);
        
        // Stake USDC for the pending garbage can
        vm.startPrank(user1);
        recyclingSystem.depositStake(pendingGarbageCanId, TARGET_AMOUNT);
        vm.stopPrank();
        
        vm.prank(deployer);
        uint256 garbageCanId = recyclingSystem.deployGarbageCan(pendingGarbageCanId);
        
        // Try to update garbage can as non-updater
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.updateFillLevel(garbageCanId, IRecyclingSystem.RecyclableType.PLASTIC, 100, 100 * 10**6);
    }
    
    /**
     * @dev Test updating a non-existent garbage can fill level
     */
    function testUpdateNonExistentGarbageCanFillLevel() public {
        vm.prank(updater);
        vm.expectRevert();
        recyclingSystem.updateFillLevel(999, IRecyclingSystem.RecyclableType.PLASTIC, 100, 100 * 10**6);
    }
}
