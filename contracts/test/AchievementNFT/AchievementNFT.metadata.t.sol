// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title AchievementNFTMetadataTest
 * @dev Tests for AchievementNFT metadata functionality
 */
contract AchievementNFTMetadataTest is BaseTest {
    // Test variables
    uint256 tokenId1;
    uint256 tokenId2;
    string baseURI;
    
    function setUp() public override {
        super.setUp();
        
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Set base URI
        baseURI = "https://example.com/api/";
        vm.prank(owner);
        achievementNFT.setBaseURI(baseURI);
        
        // Mint tokens
        vm.startPrank(owner);
        tokenId1 = 1;
        tokenId2 = 2;
        achievementNFT.mint(user1, tokenId1);
        achievementNFT.mint(user2, tokenId2);
        vm.stopPrank();
    }
    
    /**
     * @dev Test token URI
     */
    function testTokenURI() public {
        // Check token URIs
        assertEq(achievementNFT.tokenURI(tokenId1), string(abi.encodePacked(baseURI, "1")));
        assertEq(achievementNFT.tokenURI(tokenId2), string(abi.encodePacked(baseURI, "2")));
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
     * @dev Test setting base URI
     */
    function testSetBaseURI() public {
        // Set new base URI
        string memory newBaseURI = "https://newexample.com/metadata/";
        vm.prank(owner);
        achievementNFT.setBaseURI(newBaseURI);
        
        // Check token URIs with new base URI
        assertEq(achievementNFT.tokenURI(tokenId1), string(abi.encodePacked(newBaseURI, "1")));
        assertEq(achievementNFT.tokenURI(tokenId2), string(abi.encodePacked(newBaseURI, "2")));
    }
    
    /**
     * @dev Test setting base URI by non-owner
     */
    function testSetBaseURIByNonOwner() public {
        // Try to set base URI as non-owner
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.setBaseURI("https://newexample.com/metadata/");
    }
    
    /**
     * @dev Test setting empty base URI
     */
    function testSetEmptyBaseURI() public {
        // Set empty base URI
        vm.prank(owner);
        achievementNFT.setBaseURI("");
        
        // Check token URIs with empty base URI
        assertEq(achievementNFT.tokenURI(tokenId1), "1");
        assertEq(achievementNFT.tokenURI(tokenId2), "2");
    }
    
    /**
     * @dev Test token URI after transfer
     */
    function testTokenURIAfterTransfer() public {
        // Transfer token
        vm.prank(user1);
        achievementNFT.transferFrom(user1, user3, tokenId1);
        
        // Check token URI after transfer
        assertEq(achievementNFT.tokenURI(tokenId1), string(abi.encodePacked(baseURI, "1")));
    }
    
    /**
     * @dev Test setting metadata for specific token
     */
    function testSetTokenMetadata() public {
        // Set metadata for token 1
        vm.prank(owner);
        achievementNFT.setTokenMetadata(tokenId1, "special-token-1");
        
        // Check token URI with custom metadata
        assertEq(achievementNFT.tokenURI(tokenId1), string(abi.encodePacked(baseURI, "special-token-1")));
        
        // Check that token 2 still has default URI
        assertEq(achievementNFT.tokenURI(tokenId2), string(abi.encodePacked(baseURI, "2")));
    }
    
    /**
     * @dev Test setting metadata for specific token by non-owner
     */
    function testSetTokenMetadataByNonOwner() public {
        // Try to set metadata as non-owner
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.setTokenMetadata(tokenId1, "special-token-1");
    }
    
    /**
     * @dev Test setting metadata for non-existent token
     */
    function testSetTokenMetadataNonExistentToken() public {
        // Try to set metadata for non-existent token
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.setTokenMetadata(999, "special-token-999");
    }
    
    /**
     * @dev Test setting metadata for multiple tokens
     */
    function testSetTokenMetadataMultipleTokens() public {
        // Set metadata for multiple tokens
        vm.startPrank(owner);
        achievementNFT.setTokenMetadata(tokenId1, "special-token-1");
        achievementNFT.setTokenMetadata(tokenId2, "special-token-2");
        vm.stopPrank();
        
        // Check token URIs with custom metadata
        assertEq(achievementNFT.tokenURI(tokenId1), string(abi.encodePacked(baseURI, "special-token-1")));
        assertEq(achievementNFT.tokenURI(tokenId2), string(abi.encodePacked(baseURI, "special-token-2")));
    }
    
    /**
     * @dev Test setting metadata and then changing base URI
     */
    function testSetTokenMetadataAndChangeBaseURI() public {
        // Set metadata for token 1
        vm.prank(owner);
        achievementNFT.setTokenMetadata(tokenId1, "special-token-1");
        
        // Set new base URI
        string memory newBaseURI = "https://newexample.com/metadata/";
        vm.prank(owner);
        achievementNFT.setBaseURI(newBaseURI);
        
        // Check token URIs with new base URI and custom metadata
        assertEq(achievementNFT.tokenURI(tokenId1), string(abi.encodePacked(newBaseURI, "special-token-1")));
        assertEq(achievementNFT.tokenURI(tokenId2), string(abi.encodePacked(newBaseURI, "2")));
    }
    
    /**
     * @dev Test token metadata after transfer
     */
    function testTokenMetadataAfterTransfer() public {
        // Set metadata for token 1
        vm.prank(owner);
        achievementNFT.setTokenMetadata(tokenId1, "special-token-1");
        
        // Transfer token
        vm.prank(user1);
        achievementNFT.transferFrom(user1, user3, tokenId1);
        
        // Check token URI after transfer
        assertEq(achievementNFT.tokenURI(tokenId1), string(abi.encodePacked(baseURI, "special-token-1")));
    }
    
    /**
     * @dev Test resetting token metadata
     */
    function testResetTokenMetadata() public {
        // Set metadata for token 1
        vm.prank(owner);
        achievementNFT.setTokenMetadata(tokenId1, "special-token-1");
        
        // Check token URI with custom metadata
        assertEq(achievementNFT.tokenURI(tokenId1), string(abi.encodePacked(baseURI, "special-token-1")));
        
        // Reset metadata by setting it to empty string
        vm.prank(owner);
        achievementNFT.setTokenMetadata(tokenId1, "");
        
        // Check token URI is back to default
        assertEq(achievementNFT.tokenURI(tokenId1), string(abi.encodePacked(baseURI, "1")));
    }
    
    /**
     * @dev Test batch setting token metadata
     */
    function testBatchSetTokenMetadata() public {
        // Set up token IDs and metadata
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId2;
        
        string[] memory metadataURIs = new string[](2);
        metadataURIs[0] = "special-token-1";
        metadataURIs[1] = "special-token-2";
        
        // Batch set metadata
        vm.prank(owner);
        achievementNFT.batchSetTokenMetadata(tokenIds, metadataURIs);
        
        // Check token URIs with custom metadata
        assertEq(achievementNFT.tokenURI(tokenId1), string(abi.encodePacked(baseURI, "special-token-1")));
        assertEq(achievementNFT.tokenURI(tokenId2), string(abi.encodePacked(baseURI, "special-token-2")));
    }
    
    /**
     * @dev Test batch setting token metadata with mismatched arrays
     */
    function testBatchSetTokenMetadataMismatchedArrays() public {
        // Set up token IDs and metadata with different lengths
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId2;
        
        string[] memory metadataURIs = new string[](1);
        metadataURIs[0] = "special-token-1";
        
        // Try to batch set metadata with mismatched arrays
        vm.prank(owner);
        vm.expectRevert();
        achievementNFT.batchSetTokenMetadata(tokenIds, metadataURIs);
    }
    
    /**
     * @dev Test batch setting token metadata by non-owner
     */
    function testBatchSetTokenMetadataByNonOwner() public {
        // Set up token IDs and metadata
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId2;
        
        string[] memory metadataURIs = new string[](2);
        metadataURIs[0] = "special-token-1";
        metadataURIs[1] = "special-token-2";
        
        // Try to batch set metadata as non-owner
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.batchSetTokenMetadata(tokenIds, metadataURIs);
    }
}
