// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title AchievementNFTMintingTest
 * @dev Tests for AchievementNFT minting functionality
 */
contract AchievementNFTMintingTest is BaseTest {
    function setUp() public override {
        super.setUp();
        
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
    }
    
    /**
     * @dev Test minting a token
     */
    function testMint() public {
        // Mint a token
        vm.prank(owner);
        achievementNFT.mint(user1, 1);
        
        // Check token ownership
        assertEq(achievementNFT.ownerOf(1), user1);
        assertEq(achievementNFT.balanceOf(user1), 1);
        
        // Check total supply
        assertEq(achievementNFT.totalSupply(), 1);
    }
    
    /**
     * @dev Test minting by authorized minter
     */
    function testMintByAuthorizedMinter() public {
        // Authorize a minter
        vm.prank(owner);
        achievementNFT.authorizeMinter(user1);
        
        // Mint a token
        vm.prank(user1);
        achievementNFT.mint(user2, 1);
        
        // Check token ownership
        assertEq(achievementNFT.ownerOf(1), user2);
        assertEq(achievementNFT.balanceOf(user2), 1);
    }
    
    /**
     * @dev Test minting by unauthorized minter
     */
    function testMintByUnauthorizedMinter() public {
        // Try to mint as unauthorized minter
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.mint(user2, 1);
    }
    
    /**
     * @dev Test minting to zero address
     */
    function testMintToZeroAddress() public {
        // Try to mint to zero address
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.mint(address(0), 1);
    }
    
    /**
     * @dev Test minting multiple tokens
     */
    function testMintMultipleTokens() public {
        // Mint multiple tokens
        vm.startPrank(owner);
        achievementNFT.mint(user1, 1);
        achievementNFT.mint(user1, 2);
        achievementNFT.mint(user2, 3);
        vm.stopPrank();
        
        // Check token ownership
        assertEq(achievementNFT.ownerOf(1), user1);
        assertEq(achievementNFT.ownerOf(2), user1);
        assertEq(achievementNFT.ownerOf(3), user2);
        
        // Check balances
        assertEq(achievementNFT.balanceOf(user1), 2);
        assertEq(achievementNFT.balanceOf(user2), 1);
        
        // Check total supply
        assertEq(achievementNFT.totalSupply(), 3);
    }
    
    /**
     * @dev Test minting when paused
     */
    function testMintWhenPaused() public {
        // Pause the contract
        vm.prank(owner);
        achievementNFT.pause();
        
        // Try to mint when paused
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.mint(user1, 1);
        
        // Unpause
        vm.prank(owner);
        achievementNFT.unpause();
        
        // Should work now
        vm.prank(owner);
        achievementNFT.mint(user1, 1);
    }
    
    /**
     * @dev Test minting a token with an existing ID
     */
    function testMintExistingTokenId() public {
        // Mint a token
        vm.prank(owner);
        achievementNFT.mint(user1, 1);
        
        // Try to mint a token with the same ID
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.mint(user2, 1);
    }
    
    /**
     * @dev Test minting a token with ID 0
     */
    function testMintTokenIdZero() public {
        // Try to mint a token with ID 0
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.mint(user1, 0);
    }
    
    /**
     * @dev Test token URI
     */
    function testTokenURI() public {
        // Set base URI
        vm.prank(owner);
        achievementNFT.setBaseURI("https://example.com/api/");
        
        // Mint a token
        vm.prank(owner);
        achievementNFT.mint(user1, 1);
        
        // Check token URI
        assertEq(achievementNFT.tokenURI(1), "https://example.com/api/1");
    }
    
    /**
     * @dev Test token URI for non-existent token
     */
    function testTokenURINonExistentToken() public {
        // Try to get URI for non-existent token
        vm.expectRevert();
        achievementNFT.tokenURI(999);
    }
    
    /**
     * @dev Test batch minting
     */
    function testBatchMint() public {
        // Set up recipients and token IDs
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        tokenIds[2] = 3;
        
        // Batch mint
        vm.prank(owner);
        achievementNFT.batchMint(recipients, tokenIds);
        
        // Check token ownership
        assertEq(achievementNFT.ownerOf(1), user1);
        assertEq(achievementNFT.ownerOf(2), user2);
        assertEq(achievementNFT.ownerOf(3), user3);
        
        // Check balances
        assertEq(achievementNFT.balanceOf(user1), 1);
        assertEq(achievementNFT.balanceOf(user2), 1);
        assertEq(achievementNFT.balanceOf(user3), 1);
        
        // Check total supply
        assertEq(achievementNFT.totalSupply(), 3);
    }
    
    /**
     * @dev Test batch minting with mismatched arrays
     */
    function testBatchMintMismatchedArrays() public {
        // Set up recipients and token IDs with different lengths
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        
        // Try to batch mint with mismatched arrays
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.batchMint(recipients, tokenIds);
    }
    
    /**
     * @dev Test batch minting with zero address
     */
    function testBatchMintWithZeroAddress() public {
        // Set up recipients and token IDs with zero address
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = address(0);
        recipients[2] = user3;
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        tokenIds[2] = 3;
        
        // Try to batch mint with zero address
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.batchMint(recipients, tokenIds);
    }
    
    /**
     * @dev Test batch minting with duplicate token IDs
     */
    function testBatchMintWithDuplicateTokenIds() public {
        // Set up recipients and token IDs with duplicate IDs
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 1; // Duplicate
        tokenIds[2] = 3;
        
        // Try to batch mint with duplicate token IDs
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.batchMint(recipients, tokenIds);
    }
    
    /**
     * @dev Test batch minting by unauthorized minter
     */
    function testBatchMintByUnauthorizedMinter() public {
        // Set up recipients and token IDs
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        tokenIds[2] = 3;
        
        // Try to batch mint as unauthorized minter
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.batchMint(recipients, tokenIds);
    }
    
    /**
     * @dev Test batch minting when paused
     */
    function testBatchMintWhenPaused() public {
        // Set up recipients and token IDs
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        tokenIds[2] = 3;
        
        // Pause the contract
        vm.prank(owner);
        achievementNFT.pause();
        
        // Try to batch mint when paused
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.batchMint(recipients, tokenIds);
        
        // Unpause
        vm.prank(owner);
        achievementNFT.unpause();
        
        // Should work now
        vm.prank(owner);
        achievementNFT.batchMint(recipients, tokenIds);
    }
    
    /**
     * @dev Test enumerable functions
     */
    function testEnumerableFunctions() public {
        // Mint multiple tokens
        vm.startPrank(owner);
        achievementNFT.mint(user1, 1);
        achievementNFT.mint(user1, 2);
        achievementNFT.mint(user2, 3);
        vm.stopPrank();
        
        // Check token by index
        assertEq(achievementNFT.tokenByIndex(0), 1);
        assertEq(achievementNFT.tokenByIndex(1), 2);
        assertEq(achievementNFT.tokenByIndex(2), 3);
        
        // Check token of owner by index
        assertEq(achievementNFT.tokenOfOwnerByIndex(user1, 0), 1);
        assertEq(achievementNFT.tokenOfOwnerByIndex(user1, 1), 2);
        assertEq(achievementNFT.tokenOfOwnerByIndex(user2, 0), 3);
    }
}
