// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title RecyclingSystemDeploymentTest
 * @dev Tests for RecyclingSystem contract deployment and initialization
 */
contract RecyclingSystemDeploymentTest is BaseTest {
    function setUp() public override {
        super.setUp();
        
        // Deploy TrashToken for RecyclingSystem
        trashToken = new TrashToken(owner);
        
        // Deploy StakeNFT for RecyclingSystem
        stakeNFT = new StakeNFT(owner, address(trashToken));
    }
    
    /**
     * @dev Test constructor and initial state
     */
    function testConstructor() public {
        // Deploy RecyclingSystem
        recyclingSystem = new RecyclingSystem(
            owner,
            address(usdcToken),
            address(stakeNFT),
            address(trashToken)
        );
        
        // Check owner
        assertEq(recyclingSystem.owner(), owner);
        
        // Check that owner is authorized as updater and deployer
        assertTrue(recyclingSystem.isAuthorizedUpdater(owner));
        assertTrue(recyclingSystem.isAuthorizedDeployer(owner));
        
        // Check that other addresses are not authorized
        assertFalse(recyclingSystem.isAuthorizedUpdater(user1));
        assertFalse(recyclingSystem.isAuthorizedDeployer(user1));
    }
    
    /**
     * @dev Test constructor with zero address for USDC
     */
    function testConstructorZeroAddressUSDC() public {
        vm.expectRevert();
        new RecyclingSystem(
            owner,
            address(0),
            address(stakeNFT),
            address(trashToken)
        );
    }
    
    /**
     * @dev Test constructor with zero address for StakeNFT
     */
    function testConstructorZeroAddressStakeNFT() public {
        vm.expectRevert();
        new RecyclingSystem(
            owner,
            address(usdcToken),
            address(0),
            address(trashToken)
        );
    }
    
    /**
     * @dev Test constructor with zero address for TrashToken
     */
    function testConstructorZeroAddressTrashToken() public {
        vm.expectRevert();
        new RecyclingSystem(
            owner,
            address(usdcToken),
            address(stakeNFT),
            address(0)
        );
    }
    
    /**
     * @dev Test constructor with zero address for owner
     */
    function testConstructorZeroAddressOwner() public {
        vm.expectRevert();
        new RecyclingSystem(
            address(0),
            address(usdcToken),
            address(stakeNFT),
            address(trashToken)
        );
    }
    
    /**
     * @dev Test system statistics after deployment
     */
    function testInitialSystemStats() public {
        // Deploy RecyclingSystem
        recyclingSystem = new RecyclingSystem(
            owner,
            address(usdcToken),
            address(stakeNFT),
            address(trashToken)
        );
        
        // Get system stats
        (
            uint256 totalGarbageCans,
            uint256 totalPendingGarbageCans,
            uint256 totalActiveGarbageCans,
            uint256 totalStaked,
            uint256 totalRecycled,
            uint256 totalValue
        ) = recyclingSystem.getSystemStats();
        
        // Check initial stats
        assertEq(totalGarbageCans, 0);
        assertEq(totalPendingGarbageCans, 0);
        assertEq(totalActiveGarbageCans, 0);
        assertEq(totalStaked, 0);
        assertEq(totalRecycled, 0);
        assertEq(totalValue, 0);
    }
    
    /**
     * @dev Test pausing and unpausing
     */
    function testPauseUnpause() public {
        // Deploy RecyclingSystem
        recyclingSystem = new RecyclingSystem(
            owner,
            address(usdcToken),
            address(stakeNFT),
            address(trashToken)
        );
        
        // Pause
        recyclingSystem.pause();
        
        // Try to create a pending garbage can while paused
        vm.expectRevert();
        recyclingSystem.createPendingGarbageCan("Test Location", 1000);
        
        // Unpause
        recyclingSystem.unpause();
        
        // Should work now
        uint256 pendingGarbageCanId = recyclingSystem.createPendingGarbageCan("Test Location", 1000);
        assertEq(pendingGarbageCanId, 0);
    }
    
    /**
     * @dev Test pausing by non-owner
     */
    function testPauseByNonOwner() public {
        // Deploy RecyclingSystem
        recyclingSystem = new RecyclingSystem(
            owner,
            address(usdcToken),
            address(stakeNFT),
            address(trashToken)
        );
        
        // Try to pause as non-owner
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.pause();
    }
    
    /**
     * @dev Test unpausing by non-owner
     */
    function testUnpauseByNonOwner() public {
        // Deploy RecyclingSystem
        recyclingSystem = new RecyclingSystem(
            owner,
            address(usdcToken),
            address(stakeNFT),
            address(trashToken)
        );
        
        // Pause
        recyclingSystem.pause();
        
        // Try to unpause as non-owner
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.unpause();
    }
}
