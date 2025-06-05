// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title AchievementNFTDeploymentTest
 * @dev Tests for AchievementNFT contract deployment and initialization
 */
contract AchievementNFTDeploymentTest is BaseTest {
    function setUp() public override {
        super.setUp();
    }
    
    /**
     * @dev Test constructor and initial state
     */
    function testConstructor() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Check owner
        assertEq(achievementNFT.owner(), owner);
        
        // Check that owner is authorized as minter
        assertTrue(achievementNFT.isAuthorizedMinter(owner));
        
        // Check that other addresses are not authorized
        assertFalse(achievementNFT.isAuthorizedMinter(user1));
        
        // Check initial supply
        assertEq(achievementNFT.totalSupply(), 0);
    }
    
    /**
     * @dev Test constructor with zero address for owner
     */
    function testConstructorZeroAddressOwner() public {
        vm.expectRevert();
        new AchievementNFT(address(0));
    }
    
    /**
     * @dev Test token name and symbol
     */
    function testNameAndSymbol() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Check name and symbol
        assertEq(achievementNFT.name(), "Achievement NFT");
        assertEq(achievementNFT.symbol(), "ACHIEVE");
    }
    
    /**
     * @dev Test pausing and unpausing
     */
    function testPauseUnpause() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Pause
        achievementNFT.pause();
        
        // Try to mint while paused
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.mint(user1, 1);
        
        // Unpause
        achievementNFT.unpause();
        
        // Should work now
        vm.prank(owner);
        achievementNFT.mint(user1, 1);
    }
    
    /**
     * @dev Test pausing by non-owner
     */
    function testPauseByNonOwner() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Try to pause as non-owner
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.pause();
    }
    
    /**
     * @dev Test unpausing by non-owner
     */
    function testUnpauseByNonOwner() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Pause
        achievementNFT.pause();
        
        // Try to unpause as non-owner
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.unpause();
    }
    
    /**
     * @dev Test supports interface
     */
    function testSupportsInterface() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Check ERC721 interface
        assertTrue(achievementNFT.supportsInterface(0x80ac58cd));
        
        // Check ERC721Metadata interface
        assertTrue(achievementNFT.supportsInterface(0x5b5e139f));
        
        // Check ERC721Enumerable interface
        assertTrue(achievementNFT.supportsInterface(0x780e9d63));
        
        // Check ERC165 interface
        assertTrue(achievementNFT.supportsInterface(0x01ffc9a7));
        
        // Check non-supported interface
        assertFalse(achievementNFT.supportsInterface(0x12345678));
    }
    
    /**
     * @dev Test transferring ownership
     */
    function testTransferOwnership() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Transfer ownership
        achievementNFT.transferOwnership(user1);
        
        // Check new owner
        assertEq(achievementNFT.owner(), user1);
        
        // Check that old owner can no longer perform owner actions
        vm.expectRevert();
        achievementNFT.authorizeMinter(user2);
        
        // Check that new owner can perform owner actions
        vm.prank(user1);
        achievementNFT.authorizeMinter(user2);
        assertTrue(achievementNFT.isAuthorizedMinter(user2));
    }
    
    /**
     * @dev Test transferring ownership by non-owner
     */
    function testTransferOwnershipByNonOwner() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Try to transfer ownership as non-owner
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.transferOwnership(user2);
    }
    
    /**
     * @dev Test transferring ownership to zero address
     */
    function testTransferOwnershipToZeroAddress() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Try to transfer ownership to zero address
        vm.expectRevert();
        achievementNFT.transferOwnership(address(0));
    }
    
    /**
     * @dev Test authorizing a minter
     */
    function testAuthorizeMinter() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Authorize minter
        achievementNFT.authorizeMinter(user1);
        
        // Check that user1 is authorized
        assertTrue(achievementNFT.isAuthorizedMinter(user1));
    }
    
    /**
     * @dev Test authorizing a minter by non-owner
     */
    function testAuthorizeMinterByNonOwner() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Try to authorize minter as non-owner
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.authorizeMinter(user2);
    }
    
    /**
     * @dev Test revoking a minter
     */
    function testRevokeMinter() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Authorize minter
        achievementNFT.authorizeMinter(user1);
        assertTrue(achievementNFT.isAuthorizedMinter(user1));
        
        // Revoke minter
        achievementNFT.revokeMinter(user1);
        
        // Check that user1 is no longer authorized
        assertFalse(achievementNFT.isAuthorizedMinter(user1));
    }
    
    /**
     * @dev Test revoking a minter by non-owner
     */
    function testRevokeMinterByNonOwner() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Authorize minter
        achievementNFT.authorizeMinter(user1);
        
        // Try to revoke minter as non-owner
        vm.prank(user2);
        vm.expectRevert();
        achievementNFT.revokeMinter(user1);
    }
    
    /**
     * @dev Test setting base URI
     */
    function testSetBaseURI() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Set base URI
        string memory newBaseURI = "https://example.com/api/";
        achievementNFT.setBaseURI(newBaseURI);
        
        // Mint a token
        vm.prank(owner);
        achievementNFT.mint(user1, 1);
        
        // Check token URI
        assertEq(achievementNFT.tokenURI(1), string(abi.encodePacked(newBaseURI, "1")));
    }
    
    /**
     * @dev Test setting base URI by non-owner
     */
    function testSetBaseURIByNonOwner() public {
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Try to set base URI as non-owner
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.setBaseURI("https://example.com/api/");
    }
}
