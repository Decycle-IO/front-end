// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title StakeNFTDeploymentTest
 * @dev Tests for StakeNFT contract deployment and initialization
 */
contract StakeNFTDeploymentTest is BaseTest {
    function setUp() public override {
        super.setUp();
        
        // Deploy TrashToken for StakeNFT
        trashToken = new TrashToken(owner);
    }
    
    /**
     * @dev Test constructor and initial state
     */
    function testConstructor() public {
        // Deploy StakeNFT
        stakeNFT = new StakeNFT(owner, address(trashToken));
        
        // Check owner
        assertEq(stakeNFT.owner(), owner);
        
        // Check TrashToken address
        assertEq(address(stakeNFT.trashToken()), address(trashToken));
        
        // Check that owner is authorized as minter
        assertTrue(stakeNFT.isAuthorizedMinter(owner));
        
        // Check that other addresses are not authorized
        assertFalse(stakeNFT.isAuthorizedMinter(user1));
    }
    
    /**
     * @dev Test constructor with zero address for owner
     */
    function testConstructorZeroAddressOwner() public {
        vm.expectRevert();
        new StakeNFT(address(0), address(trashToken));
    }
    
    /**
     * @dev Test constructor with zero address for TrashToken
     */
    function testConstructorZeroAddressTrashToken() public {
        vm.expectRevert();
        new StakeNFT(owner, address(0));
    }
    
    /**
     * @dev Test initial token URI
     */
    function testInitialTokenURI() public {
        // Deploy StakeNFT
        stakeNFT = new StakeNFT(owner, address(trashToken));
        
        // Mint a token
        vm.prank(owner);
        uint256 tokenId = stakeNFT.mintStake(user1, 1, 100, 10000);
        
        // Check token URI
        string memory uri = stakeNFT.tokenURI(tokenId);
        
        // URI should be non-empty
        assertTrue(bytes(uri).length > 0);
    }
    
    /**
     * @dev Test token counter
     */
    function testTokenCounter() public {
        // Deploy StakeNFT
        stakeNFT = new StakeNFT(owner, address(trashToken));
        
        // Mint multiple tokens
        vm.startPrank(owner);
        uint256 tokenId1 = stakeNFT.mintStake(user1, 1, 100, 10000);
        uint256 tokenId2 = stakeNFT.mintStake(user2, 1, 200, 10000);
        uint256 tokenId3 = stakeNFT.mintStake(user3, 1, 300, 10000);
        vm.stopPrank();
        
        // Check token IDs
        assertEq(tokenId1, 0);
        assertEq(tokenId2, 1);
        assertEq(tokenId3, 2);
    }
    
    /**
     * @dev Test pausing and unpausing
     */
    function testPauseUnpause() public {
        // Deploy StakeNFT
        stakeNFT = new StakeNFT(owner, address(trashToken));
        
        // Pause
        stakeNFT.pause();
        
        // Try to mint while paused
        vm.expectRevert();
        vm.prank(owner);
        stakeNFT.mintStake(user1, 1, 100, 10000);
        
        // Unpause
        stakeNFT.unpause();
        
        // Should work now
        vm.prank(owner);
        stakeNFT.mintStake(user1, 1, 100, 10000);
    }
    
    /**
     * @dev Test pausing by non-owner
     */
    function testPauseByNonOwner() public {
        // Deploy StakeNFT
        stakeNFT = new StakeNFT(owner, address(trashToken));
        
        // Try to pause as non-owner
        vm.prank(user1);
        vm.expectRevert();
        stakeNFT.pause();
    }
    
    /**
     * @dev Test unpausing by non-owner
     */
    function testUnpauseByNonOwner() public {
        // Deploy StakeNFT
        stakeNFT = new StakeNFT(owner, address(trashToken));
        
        // Pause
        stakeNFT.pause();
        
        // Try to unpause as non-owner
        vm.prank(user1);
        vm.expectRevert();
        stakeNFT.unpause();
    }
    
    /**
     * @dev Test supports interface
     */
    function testSupportsInterface() public {
        // Deploy StakeNFT
        stakeNFT = new StakeNFT(owner, address(trashToken));
        
        // Check ERC721 interface
        assertTrue(stakeNFT.supportsInterface(0x80ac58cd));
        
        // Check ERC721Metadata interface
        assertTrue(stakeNFT.supportsInterface(0x5b5e139f));
        
        // Check ERC165 interface
        assertTrue(stakeNFT.supportsInterface(0x01ffc9a7));
        
        // Check non-supported interface
        assertFalse(stakeNFT.supportsInterface(0x12345678));
    }
    
    /**
     * @dev Test initial token name and symbol
     */
    function testNameAndSymbol() public {
        // Deploy StakeNFT
        stakeNFT = new StakeNFT(owner, address(trashToken));
        
        // Check name and symbol
        assertEq(stakeNFT.name(), "Stake NFT");
        assertEq(stakeNFT.symbol(), "STAKE");
    }
}
