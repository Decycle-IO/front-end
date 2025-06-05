// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title TrashTokenDeploymentTest
 * @dev Tests for TrashToken contract deployment and initialization
 */
contract TrashTokenDeploymentTest is BaseTest {
    function setUp() public override {
        super.setUp();
    }
    
    /**
     * @dev Test constructor and initial state
     */
    function testConstructor() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Check owner
        assertEq(trashToken.owner(), owner);
        
        // Check that owner is authorized as minter
        assertTrue(trashToken.isAuthorizedMinter(owner));
        
        // Check that other addresses are not authorized
        assertFalse(trashToken.isAuthorizedMinter(user1));
        
        // Check initial supply
        assertEq(trashToken.totalSupply(), 0);
    }
    
    /**
     * @dev Test constructor with zero address for owner
     */
    function testConstructorZeroAddressOwner() public {
        vm.expectRevert();
        new TrashToken(address(0));
    }
    
    /**
     * @dev Test token name and symbol
     */
    function testNameAndSymbol() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Check name and symbol
        assertEq(trashToken.name(), "TRASH");
        assertEq(trashToken.symbol(), "TRASH");
    }
    
    /**
     * @dev Test token decimals
     */
    function testDecimals() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Check decimals
        assertEq(trashToken.decimals(), 18);
    }
    
    /**
     * @dev Test pausing and unpausing
     */
    function testPauseUnpause() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Pause
        vm.prank(owner);
        trashToken.pause();
        
        // Try to transfer while paused
        vm.prank(owner);
        vm.expectRevert();
        trashToken.transfer(user1, 100);
        
        // Unpause
        vm.prank(owner);
        trashToken.unpause();
        
        // Mint some tokens
        vm.prank(owner);
        trashToken.mint(owner, 100);
        
        // Should work now
        vm.prank(owner);
        trashToken.transfer(user1, 100);
    }
    
    /**
     * @dev Test pausing by non-owner
     */
    function testPauseByNonOwner() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Try to pause as non-owner
        vm.prank(user1);
        vm.expectRevert();
        trashToken.pause();
    }
    
    /**
     * @dev Test unpausing by non-owner
     */
    function testUnpauseByNonOwner() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Pause
        vm.prank(owner);
        trashToken.pause();
        
        // Try to unpause as non-owner
        vm.prank(user1);
        vm.expectRevert();
        trashToken.unpause();
    }
    
    /**
     * @dev Test transferring ownership
     */
    function testTransferOwnership() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Transfer ownership
        vm.prank(owner);
        trashToken.transferOwnership(user1);
        
        // Check new owner
        assertEq(trashToken.owner(), user1);
        
        // Check that old owner can no longer perform owner actions
        vm.prank(owner);
        vm.expectRevert();
        trashToken.authorizeMinter(user2);
        
        // Check that new owner can perform owner actions
        vm.prank(user1);
        trashToken.authorizeMinter(user2);
        assertTrue(trashToken.isAuthorizedMinter(user2));
    }
    
    /**
     * @dev Test transferring ownership by non-owner
     */
    function testTransferOwnershipByNonOwner() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Try to transfer ownership as non-owner
        vm.prank(user1);
        vm.expectRevert();
        trashToken.transferOwnership(user2);
    }
    
    /**
     * @dev Test transferring ownership to zero address
     */
    function testTransferOwnershipToZeroAddress() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Try to transfer ownership to zero address
        vm.prank(owner);
        vm.expectRevert();
        trashToken.transferOwnership(address(0));
    }
    
    /**
     * @dev Test authorizing a minter
     */
    function testAuthorizeMinter() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Authorize minter
        vm.prank(owner);
        trashToken.authorizeMinter(user1);
        
        // Check that user1 is authorized
        assertTrue(trashToken.isAuthorizedMinter(user1));
    }
    
    /**
     * @dev Test authorizing a minter by non-owner
     */
    function testAuthorizeMinterByNonOwner() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Try to authorize minter as non-owner
        vm.prank(user1);
        vm.expectRevert();
        trashToken.authorizeMinter(user2);
    }
    
    /**
     * @dev Test unauthorizing a minter
     */
    function testUnauthorizeMinter() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Authorize minter
        vm.prank(owner);
        trashToken.authorizeMinter(user1);
        assertTrue(trashToken.isAuthorizedMinter(user1));
        
        // Unauthorize minter
        vm.prank(owner);
        trashToken.unauthorizeMinter(user1);
        
        // Check that user1 is no longer authorized
        assertFalse(trashToken.isAuthorizedMinter(user1));
    }
    
    /**
     * @dev Test unauthorizing a minter by non-owner
     */
    function testUnauthorizeMinterByNonOwner() public {
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Authorize minter
        vm.prank(owner);
        trashToken.authorizeMinter(user1);
        
        // Try to unauthorize minter as non-owner
        vm.prank(user2);
        vm.expectRevert();
        trashToken.unauthorizeMinter(user1);
    }
}
