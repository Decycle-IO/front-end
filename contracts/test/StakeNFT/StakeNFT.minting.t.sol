// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title StakeNFTMintingTest
 * @dev Tests for StakeNFT minting functionality
 */
contract StakeNFTMintingTest is BaseTest {
    // Test constants
    uint256 constant STAKE_AMOUNT = 100 * 10**6; // 100 USDC
    
    function setUp() public override {
        super.setUp();
        
        // Deploy full system
        deployFullSystem();
    }
    
    /**
     * @dev Test minting a token
     */
    function testMint() public {
        // Mint a token
        vm.prank(owner);
        uint256 tokenId = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT, 10000);
        
        // Check token ownership
        assertEq(stakeNFT.ownerOf(tokenId), user1);
        assertEq(stakeNFT.balanceOf(user1), 1);
        
        // Check stake info
        IStakeNFT.StakeInfo memory stakeInfo = stakeNFT.getStakeInfo(tokenId);
        
        // Check stake amount
        assertEq(stakeInfo.stakedAmount, STAKE_AMOUNT);
        
        // Check pending rewards (should be zero)
        assertEq(stakeInfo.accumulatedRewards, 0);
    }
    
    /**
     * @dev Test minting by authorized minter
     */
    function testMintByAuthorizedMinter() public {
        // Authorize a minter
        vm.prank(owner);
        stakeNFT.authorizeMinter(user1);
        
        // Mint a token
        vm.prank(user1);
        uint256 tokenId = stakeNFT.mintStake(user2, 1, STAKE_AMOUNT, 10000);
        
        // Check token ownership
        assertEq(stakeNFT.ownerOf(tokenId), user2);
        assertEq(stakeNFT.balanceOf(user2), 1);
    }
    
    /**
     * @dev Test minting by unauthorized minter
     */
    function testMintByUnauthorizedMinter() public {
        // Try to mint as unauthorized minter
        vm.prank(user1);
        vm.expectRevert();
        stakeNFT.mintStake(user2, 1, STAKE_AMOUNT, 10000);
    }
    
    /**
     * @dev Test minting with zero amount
     */
    function testMintZeroAmount() public {
        // Mint with zero amount - should revert with ZeroAmount
        vm.prank(owner);
        vm.expectRevert(StakeNFT.ZeroAmount.selector);
        stakeNFT.mintStake(user1, 1, 0, 10000);
    }
    
    /**
     * @dev Test minting to zero address
     */
    function testMintToZeroAddress() public {
        // Try to mint to zero address
        vm.prank(owner);
        vm.expectRevert();
        stakeNFT.mintStake(address(0), 1, STAKE_AMOUNT, 10000);
    }
    
    /**
     * @dev Test minting multiple tokens
     */
    function testMintMultipleTokens() public {
        // Mint multiple tokens
        vm.startPrank(owner);
        uint256 tokenId1 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT, 10000);
        uint256 tokenId2 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT * 2, 10000);
        uint256 tokenId3 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT * 3, 10000);
        vm.stopPrank();
        
        // Check token ownership
        assertEq(stakeNFT.ownerOf(tokenId1), user1);
        assertEq(stakeNFT.ownerOf(tokenId2), user1);
        assertEq(stakeNFT.ownerOf(tokenId3), user1);
        assertEq(stakeNFT.balanceOf(user1), 3);
        
        // Check stake amounts
        IStakeNFT.StakeInfo memory stakeInfo1 = stakeNFT.getStakeInfo(tokenId1);
        IStakeNFT.StakeInfo memory stakeInfo2 = stakeNFT.getStakeInfo(tokenId2);
        IStakeNFT.StakeInfo memory stakeInfo3 = stakeNFT.getStakeInfo(tokenId3);
        
        assertEq(stakeInfo1.stakedAmount, STAKE_AMOUNT);
        assertEq(stakeInfo2.stakedAmount, STAKE_AMOUNT * 2);
        assertEq(stakeInfo3.stakedAmount, STAKE_AMOUNT * 3);
    }
    
    /**
     * @dev Test minting when paused
     */
    function testMintWhenPaused() public {
        // Pause the contract
        vm.prank(owner);
        stakeNFT.pause();
        
        // Try to mint when paused
        vm.prank(owner);
        vm.expectRevert();
        stakeNFT.mintStake(user1, 1, STAKE_AMOUNT, 10000);
        
        // Unpause
        vm.prank(owner);
        stakeNFT.unpause();
        
        // Should work now
        vm.prank(owner);
        stakeNFT.mintStake(user1, 1, STAKE_AMOUNT, 10000);
    }
    
    /**
     * @dev Test getting all tokens for a user
     */
    function testGetTokensForUser() public {
        // Mint multiple tokens for different users
        vm.startPrank(owner);
        uint256 tokenId1 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT, 10000);
        uint256 tokenId2 = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT * 2, 10000);
        uint256 tokenId3 = stakeNFT.mintStake(user2, 1, STAKE_AMOUNT * 3, 10000);
        vm.stopPrank();
        
        // Get tokens for user1
        uint256[] memory tokensUser1 = stakeNFT.getTokensByOwner(user1);
        
        // Check token count
        assertEq(tokensUser1.length, 2);
        
        // Check token IDs (order may vary)
        assertTrue(tokensUser1[0] == tokenId1 || tokensUser1[0] == tokenId2);
        assertTrue(tokensUser1[1] == tokenId1 || tokensUser1[1] == tokenId2);
        assertTrue(tokensUser1[0] != tokensUser1[1]);
        
        // Get tokens for user2
        uint256[] memory tokensUser2 = stakeNFT.getTokensByOwner(user2);
        
        // Check token count
        assertEq(tokensUser2.length, 1);
        
        // Check token ID
        assertEq(tokensUser2[0], tokenId3);
    }
    
    /**
     * @dev Test getting tokens for a user with no tokens
     */
    function testGetTokensForUserWithNoTokens() public {
        // Get tokens for user with no tokens
        uint256[] memory tokens = stakeNFT.getTokensByOwner(user1);
        
        // Check token count
        assertEq(tokens.length, 0);
    }
    
    /**
     * @dev Test token URI
     */
    function testTokenURI() public {
        // Mint a token
        vm.prank(owner);
        uint256 tokenId = stakeNFT.mintStake(user1, 1, STAKE_AMOUNT, 10000);
        
        // Get token URI
        string memory uri = stakeNFT.tokenURI(tokenId);
        
        // URI should be non-empty
        assertTrue(bytes(uri).length > 0);
    }
    
    /**
     * @dev Test token URI for non-existent token
     */
    function testTokenURINonExistentToken() public {
        // Try to get URI for non-existent token
        vm.expectRevert();
        stakeNFT.tokenURI(999);
    }
    
    /**
     * @dev Test authorizing a minter
     */
    function testAuthorizeMinter() public {
        // Check initial state
        assertFalse(stakeNFT.isAuthorizedMinter(user1));
        
        // Authorize minter
        vm.prank(owner);
        stakeNFT.authorizeMinter(user1);
        
        // Check state after authorization
        assertTrue(stakeNFT.isAuthorizedMinter(user1));
    }
    
    /**
     * @dev Test revoking a minter
     */
    function testRevokeMinter() public {
        // Authorize minter
        vm.prank(owner);
        stakeNFT.authorizeMinter(user1);
        assertTrue(stakeNFT.isAuthorizedMinter(user1));
        
        // Revoke minter
        vm.prank(owner);
        stakeNFT.unauthorizeMinter(user1);
        
        // Check state after revocation
        assertFalse(stakeNFT.isAuthorizedMinter(user1));
    }
    
    /**
     * @dev Test authorizing a minter by non-owner
     */
    function testAuthorizeMinterByNonOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        stakeNFT.authorizeMinter(user2);
    }
    
    /**
     * @dev Test revoking a minter by non-owner
     */
    function testRevokeMinterByNonOwner() public {
        // Authorize minter
        vm.prank(owner);
        stakeNFT.authorizeMinter(user1);
        
        // Try to revoke as non-owner
        vm.prank(user1);
        vm.expectRevert();
        stakeNFT.unauthorizeMinter(user1);
    }
}
