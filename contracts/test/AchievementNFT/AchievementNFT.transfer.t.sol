// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title AchievementNFTTransferTest
 * @dev Tests for AchievementNFT transfer functionality
 */
contract AchievementNFTTransferTest is BaseTest {
    // Test variables
    uint256 tokenId1;
    uint256 tokenId2;
    
    function setUp() public override {
        super.setUp();
        
        // Deploy AchievementNFT
        achievementNFT = new AchievementNFT(owner);
        
        // Mint tokens
        vm.startPrank(owner);
        tokenId1 = 1;
        tokenId2 = 2;
        achievementNFT.mint(user1, tokenId1);
        achievementNFT.mint(user1, tokenId2);
        vm.stopPrank();
    }
    
    /**
     * @dev Test transferring a token
     */
    function testTransfer() public {
        // Check initial ownership
        assertEq(achievementNFT.ownerOf(tokenId1), user1);
        assertEq(achievementNFT.balanceOf(user1), 2);
        assertEq(achievementNFT.balanceOf(user2), 0);
        
        // Transfer token
        vm.prank(user1);
        achievementNFT.transferFrom(user1, user2, tokenId1);
        
        // Check ownership after transfer
        assertEq(achievementNFT.ownerOf(tokenId1), user2);
        assertEq(achievementNFT.balanceOf(user1), 1);
        assertEq(achievementNFT.balanceOf(user2), 1);
    }
    
    /**
     * @dev Test transferring by non-owner
     */
    function testTransferByNonOwner() public {
        // Try to transfer as non-owner
        vm.prank(user2);
        vm.expectRevert();
        achievementNFT.transferFrom(user1, user2, tokenId1);
    }
    
    /**
     * @dev Test transferring to zero address
     */
    function testTransferToZeroAddress() public {
        // Try to transfer to zero address
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.transferFrom(user1, address(0), tokenId1);
    }
    
    /**
     * @dev Test transferring a non-existent token
     */
    function testTransferNonExistentToken() public {
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.transferFrom(user1, user2, 999);
    }
    
    /**
     * @dev Test transferring when paused
     */
    function testTransferWhenPaused() public {
        // Pause the contract
        vm.prank(owner);
        achievementNFT.pause();
        
        // Try to transfer when paused
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.transferFrom(user1, user2, tokenId1);
        
        // Unpause
        vm.prank(owner);
        achievementNFT.unpause();
        
        // Should work now
        vm.prank(user1);
        achievementNFT.transferFrom(user1, user2, tokenId1);
    }
    
    /**
     * @dev Test safe transferring
     */
    function testSafeTransfer() public {
        // Safe transfer token
        vm.prank(user1);
        achievementNFT.safeTransferFrom(user1, user2, tokenId1);
        
        // Check ownership after transfer
        assertEq(achievementNFT.ownerOf(tokenId1), user2);
        assertEq(achievementNFT.balanceOf(user1), 1);
        assertEq(achievementNFT.balanceOf(user2), 1);
    }
    
    /**
     * @dev Test safe transferring with data
     */
    function testSafeTransferWithData() public {
        // Safe transfer token with data
        vm.prank(user1);
        achievementNFT.safeTransferFrom(user1, user2, tokenId1, "0x12345678");
        
        // Check ownership after transfer
        assertEq(achievementNFT.ownerOf(tokenId1), user2);
        assertEq(achievementNFT.balanceOf(user1), 1);
        assertEq(achievementNFT.balanceOf(user2), 1);
    }
    
    /**
     * @dev Test approving and transferring
     */
    function testApproveAndTransfer() public {
        // Approve user2 to transfer
        vm.prank(user1);
        achievementNFT.approve(user2, tokenId1);
        
        // Check approval
        assertEq(achievementNFT.getApproved(tokenId1), user2);
        
        // Transfer by approved user
        vm.prank(user2);
        achievementNFT.transferFrom(user1, user2, tokenId1);
        
        // Check ownership after transfer
        assertEq(achievementNFT.ownerOf(tokenId1), user2);
        
        // Check approval was cleared
        assertEq(achievementNFT.getApproved(tokenId1), address(0));
    }
    
    /**
     * @dev Test approving for all and transferring
     */
    function testApproveForAllAndTransfer() public {
        // Approve user2 for all tokens
        vm.prank(user1);
        achievementNFT.setApprovalForAll(user2, true);
        
        // Check approval
        assertTrue(achievementNFT.isApprovedForAll(user1, user2));
        
        // Transfer both tokens by approved operator
        vm.startPrank(user2);
        achievementNFT.transferFrom(user1, user2, tokenId1);
        achievementNFT.transferFrom(user1, user2, tokenId2);
        vm.stopPrank();
        
        // Check ownership after transfers
        assertEq(achievementNFT.ownerOf(tokenId1), user2);
        assertEq(achievementNFT.ownerOf(tokenId2), user2);
        assertEq(achievementNFT.balanceOf(user1), 0);
        assertEq(achievementNFT.balanceOf(user2), 2);
    }
    
    /**
     * @dev Test revoking approval
     */
    function testRevokeApproval() public {
        // Approve user2 to transfer
        vm.prank(user1);
        achievementNFT.approve(user2, tokenId1);
        
        // Check approval
        assertEq(achievementNFT.getApproved(tokenId1), user2);
        
        // Revoke approval
        vm.prank(user1);
        achievementNFT.approve(address(0), tokenId1);
        
        // Check approval was cleared
        assertEq(achievementNFT.getApproved(tokenId1), address(0));
        
        // Try to transfer
        vm.prank(user2);
        vm.expectRevert();
        achievementNFT.transferFrom(user1, user2, tokenId1);
    }
    
    /**
     * @dev Test revoking approval for all
     */
    function testRevokeApprovalForAll() public {
        // Approve user2 for all tokens
        vm.prank(user1);
        achievementNFT.setApprovalForAll(user2, true);
        
        // Check approval
        assertTrue(achievementNFT.isApprovedForAll(user1, user2));
        
        // Revoke approval
        vm.prank(user1);
        achievementNFT.setApprovalForAll(user2, false);
        
        // Check approval was cleared
        assertFalse(achievementNFT.isApprovedForAll(user1, user2));
        
        // Try to transfer
        vm.prank(user2);
        vm.expectRevert();
        achievementNFT.transferFrom(user1, user2, tokenId1);
    }
    
    /**
     * @dev Test transferring to a contract that doesn't implement ERC721Receiver
     */
    function testSafeTransferToNonReceiver() public {
        // Deploy a contract that doesn't implement ERC721Receiver
        NonERC721Receiver nonReceiver = new NonERC721Receiver();
        
        // Try to safe transfer to non-receiver
        vm.prank(user1);
        vm.expectRevert();
        achievementNFT.safeTransferFrom(user1, address(nonReceiver), tokenId1);
    }
    
    /**
     * @dev Test transferring to a contract that implements ERC721Receiver
     */
    function testSafeTransferToReceiver() public {
        // Deploy a contract that implements ERC721Receiver
        ERC721Receiver receiver = new ERC721Receiver();
        
        // Safe transfer to receiver
        vm.prank(user1);
        achievementNFT.safeTransferFrom(user1, address(receiver), tokenId1);
        
        // Check ownership after transfer
        assertEq(achievementNFT.ownerOf(tokenId1), address(receiver));
    }
    
    /**
     * @dev Test enumerable functions after transfer
     */
    function testEnumerableFunctionsAfterTransfer() public {
        // Transfer token
        vm.prank(user1);
        achievementNFT.transferFrom(user1, user2, tokenId1);
        
        // Check token by index
        assertEq(achievementNFT.tokenByIndex(0), tokenId1);
        assertEq(achievementNFT.tokenByIndex(1), tokenId2);
        
        // Check token of owner by index
        assertEq(achievementNFT.tokenOfOwnerByIndex(user1, 0), tokenId2);
        assertEq(achievementNFT.tokenOfOwnerByIndex(user2, 0), tokenId1);
    }
}

/**
 * @dev Contract that doesn't implement ERC721Receiver
 */
contract NonERC721Receiver {
    // Empty contract
}

/**
 * @dev Contract that implements ERC721Receiver
 */
contract ERC721Receiver {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
