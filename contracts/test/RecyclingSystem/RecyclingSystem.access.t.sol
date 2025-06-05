// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title RecyclingSystemAccessTest
 * @dev Tests for RecyclingSystem access control functionality
 */
contract RecyclingSystemAccessTest is BaseTest {
    function setUp() public override {
        super.setUp();
        
        // Deploy full system
        deployFullSystem();
    }
    
    /**
     * @dev Test authorizing an updater
     */
    function testAuthorizeUpdater() public {
        // Check initial state
        assertFalse(recyclingSystem.isAuthorizedUpdater(user1));
        
        // Authorize updater
        recyclingSystem.authorizeUpdater(user1);
        
        // Check state after authorization
        assertTrue(recyclingSystem.isAuthorizedUpdater(user1));
    }
    
    /**
     * @dev Test revoking an updater
     */
    function testRevokeUpdater() public {
        // Authorize updater
        recyclingSystem.authorizeUpdater(user1);
        assertTrue(recyclingSystem.isAuthorizedUpdater(user1));
        
        // Revoke updater
        recyclingSystem.unauthorizeUpdater(user1);
        
        // Check state after revocation
        assertFalse(recyclingSystem.isAuthorizedUpdater(user1));
    }
    
    /**
     * @dev Test authorizing an updater by non-owner
     */
    function testAuthorizeUpdaterByNonOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.authorizeUpdater(user2);
    }
    
    /**
     * @dev Test revoking an updater by non-owner
     */
    function testRevokeUpdaterByNonOwner() public {
        // Authorize updater
        recyclingSystem.authorizeUpdater(user1);
        
        // Try to revoke as non-owner
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.unauthorizeUpdater(user1);
    }
    
    /**
     * @dev Test authorizing a deployer
     */
    function testAuthorizeDeployer() public {
        // Check initial state
        assertFalse(recyclingSystem.isAuthorizedDeployer(user1));
        
        // Authorize deployer
        recyclingSystem.authorizeDeployer(user1);
        
        // Check state after authorization
        assertTrue(recyclingSystem.isAuthorizedDeployer(user1));
    }
    
    /**
     * @dev Test revoking a deployer
     */
    function testRevokeDeployer() public {
        // Authorize deployer
        recyclingSystem.authorizeDeployer(user1);
        assertTrue(recyclingSystem.isAuthorizedDeployer(user1));
        
        // Revoke deployer
        recyclingSystem.unauthorizeDeployer(user1);
        
        // Check state after revocation
        assertFalse(recyclingSystem.isAuthorizedDeployer(user1));
    }
    
    /**
     * @dev Test authorizing a deployer by non-owner
     */
    function testAuthorizeDeployerByNonOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.authorizeDeployer(user2);
    }
    
    /**
     * @dev Test revoking a deployer by non-owner
     */
    function testRevokeDeployerByNonOwner() public {
        // Authorize deployer
        recyclingSystem.authorizeDeployer(user1);
        
        // Try to revoke as non-owner
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.unauthorizeDeployer(user1);
    }
    
    /**
     * @dev Test transferring ownership
     */
    function testTransferOwnership() public {
        // Check initial owner
        assertEq(recyclingSystem.owner(), owner);
        
        // Transfer ownership
        recyclingSystem.transferOwnership(user1);
        
        // Check new owner
        assertEq(recyclingSystem.owner(), user1);
        
        // Check that old owner can no longer perform owner actions
        vm.expectRevert();
        recyclingSystem.authorizeUpdater(user2);
        
        // Check that new owner can perform owner actions
        vm.prank(user1);
        recyclingSystem.authorizeUpdater(user2);
        assertTrue(recyclingSystem.isAuthorizedUpdater(user2));
    }
    
    /**
     * @dev Test transferring ownership by non-owner
     */
    function testTransferOwnershipByNonOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        recyclingSystem.transferOwnership(user2);
    }
    
    /**
     * @dev Test transferring ownership to zero address
     */
    function testTransferOwnershipToZeroAddress() public {
        vm.expectRevert();
        recyclingSystem.transferOwnership(address(0));
    }
    
    /**
     * @dev Test authorizing the zero address as updater
     */
    function testAuthorizeZeroAddressAsUpdater() public {
        vm.expectRevert();
        recyclingSystem.authorizeUpdater(address(0));
    }
    
    /**
     * @dev Test authorizing the zero address as deployer
     */
    function testAuthorizeZeroAddressAsDeployer() public {
        vm.expectRevert();
        recyclingSystem.authorizeDeployer(address(0));
    }
    
    /**
     * @dev Test revoking the zero address as updater
     */
    function testRevokeZeroAddressAsUpdater() public {
        vm.expectRevert();
        recyclingSystem.unauthorizeUpdater(address(0));
    }
    
    /**
     * @dev Test revoking the zero address as deployer
     */
    function testRevokeZeroAddressAsDeployer() public {
        vm.expectRevert();
        recyclingSystem.unauthorizeDeployer(address(0));
    }
    
    /**
     * @dev Test revoking an unauthorized updater
     */
    function testRevokeUnauthorizedUpdater() public {
        vm.expectRevert();
        recyclingSystem.unauthorizeUpdater(user1);
    }
    
    /**
     * @dev Test revoking an unauthorized deployer
     */
    function testRevokeUnauthorizedDeployer() public {
        vm.expectRevert();
        recyclingSystem.unauthorizeDeployer(user1);
    }
    
    /**
     * @dev Test authorizing an already authorized updater
     */
    function testAuthorizeAlreadyAuthorizedUpdater() public {
        // Authorize updater
        recyclingSystem.authorizeUpdater(user1);
        
        // Try to authorize again
        vm.expectRevert();
        recyclingSystem.authorizeUpdater(user1);
    }
    
    /**
     * @dev Test authorizing an already authorized deployer
     */
    function testAuthorizeAlreadyAuthorizedDeployer() public {
        // Authorize deployer
        recyclingSystem.authorizeDeployer(user1);
        
        // Try to authorize again
        vm.expectRevert();
        recyclingSystem.authorizeDeployer(user1);
    }
}
