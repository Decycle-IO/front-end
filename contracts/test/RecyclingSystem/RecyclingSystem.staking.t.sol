// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";
import "../utils/TestHelpers.sol";

/**
 * @title RecyclingSystemStakingTest
 * @dev Tests for RecyclingSystem staking functionality
 */
contract RecyclingSystemStakingTest is BaseTest {
    // Test constants
    string constant LOCATION = "Test Location";
    uint256 constant TARGET_AMOUNT = 1000 * 10**6; // 1,000 USDC
    uint256 constant STAKE_AMOUNT = 100 * 10**6; // 100 USDC
    
    // Test variables
    uint256 pendingGarbageCanId;
    uint256 garbageCanId;
    
    function setUp() public override {
        super.setUp();
        
        // Deploy full system
        deployFullSystem();
        
        // Authorize deployer if not already authorized
        if (!recyclingSystem.isAuthorizedDeployer(deployer)) {
            recyclingSystem.authorizeDeployer(deployer);
        }
        
        // Approve USDC for staking
        vm.startPrank(user1);
        usdcToken.approve(address(recyclingSystem), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(user2);
        usdcToken.approve(address(recyclingSystem), type(uint256).max);
        vm.stopPrank();
        
        // Create a pending garbage can
        pendingGarbageCanId = recyclingSystem.createPendingGarbageCan(LOCATION, TARGET_AMOUNT);
        
        // Stake in the pending garbage can to meet the target amount
        vm.prank(user1);
        recyclingSystem.depositStake(pendingGarbageCanId, TARGET_AMOUNT);
        
        // Deploy the garbage can
        vm.prank(deployer);
        garbageCanId = recyclingSystem.deployGarbageCan(pendingGarbageCanId);
    }
    
    /**
     * @dev Test staking in a garbage can
     */
    function testStake() public {
        // Create a new pending garbage can for this test
        uint256 newPendingGarbageCanId = recyclingSystem.createPendingGarbageCan("New Location", TARGET_AMOUNT);
        
        // Stake in pending garbage can
        vm.prank(user1);
        uint256 stakeId = recyclingSystem.depositStake(newPendingGarbageCanId, STAKE_AMOUNT);
        
        // Check stake
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(stakeId);
        
        assertEq(stakeNFT.ownerOf(stakeId), user1);
        assertEq(stakeInfo.stakedAmount, STAKE_AMOUNT);
        assertEq(stakeInfo.garbageCanId, newPendingGarbageCanId);
        
        // Check pending garbage can info
        (string memory location, uint256 targetAmount, uint256 currentAmount, bool isDeployed) = 
            recyclingSystem.getPendingGarbageCanInfo(newPendingGarbageCanId);
        
        assertEq(currentAmount, STAKE_AMOUNT);
        
        // Check system stats
        (
            ,
            ,
            ,
            uint256 systemTotalStaked,
            ,
            
        ) = recyclingSystem.getSystemStats();
        
        // The system total staked includes the TARGET_AMOUNT from setUp
        assertEq(systemTotalStaked, TARGET_AMOUNT + STAKE_AMOUNT);
        
        // Check NFT minted - user1 already has 1 stake from setUp
        assertEq(stakeNFT.balanceOf(user1), 2);
        assertEq(stakeNFT.ownerOf(stakeId), user1);
    }
    
    /**
     * @dev Test staking with zero amount
     */
    function testStakeZeroAmount() public {
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.depositStake(garbageCanId, 0);
    }
    
    /**
     * @dev Test staking in a non-existent garbage can
     */
    function testStakeNonExistentGarbageCan() public {
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.depositStake(999, STAKE_AMOUNT);
    }
    
    /**
     * @dev Test staking more than target amount
     */
    function testStakeMoreThanTargetAmount() public {
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.depositStake(garbageCanId, TARGET_AMOUNT + 1);
    }
    
    /**
     * @dev Test staking with insufficient balance
     */
    function testStakeInsufficientBalance() public {
        // Create a user with no balance
        address poorUser = makeAddr("poorUser");
        
        vm.startPrank(poorUser);
        usdcToken.approve(address(recyclingSystem), type(uint256).max);
        
        vm.expectRevert();
        recyclingSystem.depositStake(garbageCanId, STAKE_AMOUNT);
        vm.stopPrank();
    }
    
    /**
     * @dev Test multiple stakes in the same garbage can
     */
    function testMultipleStakes() public {
        // Create a new pending garbage can for this test
        uint256 newPendingGarbageCanId = recyclingSystem.createPendingGarbageCan("New Location", TARGET_AMOUNT);
        
        // First stake
        vm.prank(user1);
        uint256 stakeId1 = recyclingSystem.depositStake(newPendingGarbageCanId, STAKE_AMOUNT);
        
        // Second stake
        vm.prank(user2);
        uint256 stakeId2 = recyclingSystem.depositStake(newPendingGarbageCanId, STAKE_AMOUNT * 2);
        
        // Check stakes
        IStakeNFT.StakeInfo memory stakeInfo1 = stakeNFT.getStakeInfo(stakeId1);
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(stakeId2);
        
        assertEq(stakeNFT.ownerOf(stakeId1), user1);
        assertEq(stakeInfo1.stakedAmount, STAKE_AMOUNT);
        
        assertEq(stakeNFT.ownerOf(stakeId2), user2);
        assertEq(stakeInfo2.stakedAmount, STAKE_AMOUNT * 2);
        
        // Check pending garbage can info
        (string memory location, uint256 targetAmount, uint256 currentAmount, bool isDeployed) = 
            recyclingSystem.getPendingGarbageCanInfo(newPendingGarbageCanId);
        
        assertEq(currentAmount, STAKE_AMOUNT * 3);
        
        // Check system stats
        (
            ,
            ,
            ,
            uint256 systemTotalStaked,
            ,
            
        ) = recyclingSystem.getSystemStats();
        
        // The system total staked includes the TARGET_AMOUNT from setUp
        assertEq(systemTotalStaked, TARGET_AMOUNT + STAKE_AMOUNT * 3);
    }
    
    /**
     * @dev Test getting all stakes for a garbage can
     */
    function testGetStakesForGarbageCan() public {
        // Create a completely new system for this test to avoid interference
        // from stakes created in setUp()
        TrashToken newTrashToken = new TrashToken(owner);
        StakeNFT newStakeNFT = new StakeNFT(owner, address(newTrashToken));
        RecyclingSystem newRecyclingSystem = new RecyclingSystem(
            owner,
            address(usdcToken),
            address(newStakeNFT),
            address(newTrashToken)
        );
        
        // Set up the new system
        vm.startPrank(owner);
        newTrashToken.authorizeMinter(address(newRecyclingSystem));
        newStakeNFT.authorizeMinter(address(newRecyclingSystem));
        vm.stopPrank();
        
        // Authorize deployer
        vm.prank(owner);
        newRecyclingSystem.authorizeDeployer(deployer);
        
        // Create a new pending garbage can for this test
        uint256 newPendingGarbageCanId = newRecyclingSystem.createPendingGarbageCan("New Location", TARGET_AMOUNT);
        
        // Approve USDC for staking
        vm.startPrank(user1);
        usdcToken.approve(address(newRecyclingSystem), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(user2);
        usdcToken.approve(address(newRecyclingSystem), type(uint256).max);
        vm.stopPrank();
        
        // Create multiple stakes
        vm.prank(user1);
        uint256 stakeId1 = newRecyclingSystem.depositStake(newPendingGarbageCanId, STAKE_AMOUNT);
        
        vm.prank(user2);
        uint256 stakeId2 = newRecyclingSystem.depositStake(newPendingGarbageCanId, STAKE_AMOUNT * 2);
        
        // Get stakes for garbage can
        uint256[] memory stakeIds = newStakeNFT.getTokensByGarbageCan(newPendingGarbageCanId);
        
        // Check stake count - we should have 2 stakes
        assertEq(stakeIds.length, 2);
        
        // Check stake IDs - order may vary based on implementation
        bool foundStakeId1 = false;
        bool foundStakeId2 = false;
        
        for (uint256 i = 0; i < stakeIds.length; i++) {
            if (stakeIds[i] == stakeId1) {
                foundStakeId1 = true;
            } else if (stakeIds[i] == stakeId2) {
                foundStakeId2 = true;
            }
        }
        
        assertTrue(foundStakeId1, "Stake ID 1 not found");
        assertTrue(foundStakeId2, "Stake ID 2 not found");
    }
    
    /**
     * @dev Test getting all stakes for a user
     */
    function testGetStakesForUser() public {
        // Create multiple stakes for user1
        vm.startPrank(user1);
        
        // Create two pending garbage cans
        uint256 pendingGarbageCanId1 = recyclingSystem.createPendingGarbageCan("Location 1", TARGET_AMOUNT);
        uint256 pendingGarbageCanId2 = recyclingSystem.createPendingGarbageCan("Location 2", TARGET_AMOUNT);
        
        // Stake in both pending garbage cans
        uint256 stakeId1 = recyclingSystem.depositStake(pendingGarbageCanId1, STAKE_AMOUNT);
        uint256 stakeId2 = recyclingSystem.depositStake(pendingGarbageCanId2, STAKE_AMOUNT * 2);
        vm.stopPrank();
        
        // Get stakes for user
        uint256[] memory stakeIds = stakeNFT.getTokensByOwner(user1);
        
        // Check stake count - we should have 2 stakes plus the one from setUp
        assertEq(stakeIds.length, 3);
        
        // Check stake IDs - order may vary based on implementation
        bool foundStakeId1 = false;
        bool foundStakeId2 = false;
        
        for (uint256 i = 0; i < stakeIds.length; i++) {
            if (stakeIds[i] == stakeId1) {
                foundStakeId1 = true;
            } else if (stakeIds[i] == stakeId2) {
                foundStakeId2 = true;
            }
        }
        
        assertTrue(foundStakeId1, "Stake ID 1 not found");
        assertTrue(foundStakeId2, "Stake ID 2 not found");
    }
    
    /**
     * @dev Test staking up to target amount
     */
    function testStakeUpToTargetAmount() public {
        // Create a new pending garbage can for this test
        uint256 newPendingGarbageCanId = recyclingSystem.createPendingGarbageCan("New Location", TARGET_AMOUNT);
        
        // Stake almost up to target amount
        vm.prank(user1);
        recyclingSystem.depositStake(newPendingGarbageCanId, TARGET_AMOUNT - STAKE_AMOUNT);
        
        // Stake the remaining amount
        vm.prank(user2);
        recyclingSystem.depositStake(newPendingGarbageCanId, STAKE_AMOUNT);
        
        // Check pending garbage can info
        (string memory location, uint256 targetAmount, uint256 currentAmount, bool isDeployed) = 
            recyclingSystem.getPendingGarbageCanInfo(newPendingGarbageCanId);
        
        assertEq(currentAmount, TARGET_AMOUNT);
        
        // Deploy the garbage can
        vm.prank(deployer);
        uint256 newGarbageCanId = recyclingSystem.deployGarbageCan(newPendingGarbageCanId);
        
        // Try to stake more in the pending garbage can (should fail because it's deployed)
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.depositStake(newPendingGarbageCanId, 1);
    }
    
    /**
     * @dev Test staking in a paused system
     */
    function testStakeWhenPaused() public {
        // Create a new pending garbage can for this test
        uint256 newPendingGarbageCanId = recyclingSystem.createPendingGarbageCan("New Location", TARGET_AMOUNT);
        
        // Pause the system
        recyclingSystem.pause();
        
        // Try to stake
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.depositStake(newPendingGarbageCanId, STAKE_AMOUNT);
        
        // Unpause
        recyclingSystem.unpause();
        
        // Should work now
        vm.prank(user1);
        recyclingSystem.depositStake(newPendingGarbageCanId, STAKE_AMOUNT);
    }
}
