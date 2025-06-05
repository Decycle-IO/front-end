// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title TrashTokenTransferTest
 * @dev Tests for TrashToken transfer functionality
 */
contract TrashTokenTransferTest is BaseTest {
    // Test constants
    uint256 constant MINT_AMOUNT = 1000 * 10**6; // 1,000 TRASH
    uint256 constant TRANSFER_AMOUNT = 400 * 10**6; // 400 TRASH
    
    function setUp() public override {
        super.setUp();
        
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Mint tokens
        vm.prank(owner);
        trashToken.mint(user1, MINT_AMOUNT);
    }
    
    /**
     * @dev Test transferring tokens
     */
    function testTransfer() public {
        // Check initial balances
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT);
        assertEq(trashToken.balanceOf(user2), 0);
        
        // Transfer tokens
        vm.prank(user1);
        trashToken.transfer(user2, TRANSFER_AMOUNT);
        
        // Check balances after transfer
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - TRANSFER_AMOUNT);
        assertEq(trashToken.balanceOf(user2), TRANSFER_AMOUNT);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT);
    }
    
    /**
     * @dev Test transferring tokens with insufficient balance
     */
    function testTransferInsufficientBalance() public {
        // Try to transfer more tokens than balance
        vm.prank(user1);
        vm.expectRevert();
        trashToken.transfer(user2, MINT_AMOUNT + 1);
    }
    
    /**
     * @dev Test transferring zero tokens
     */
    function testTransferZeroTokens() public {
        // Transfer zero tokens
        vm.prank(user1);
        trashToken.transfer(user2, 0);
        
        // Check balances
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT);
        assertEq(trashToken.balanceOf(user2), 0);
    }
    
    /**
     * @dev Test transferring to zero address
     */
    function testTransferToZeroAddress() public {
        // Try to transfer to zero address
        vm.prank(user1);
        vm.expectRevert();
        trashToken.transfer(address(0), TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test transferring when paused
     */
    function testTransferWhenPaused() public {
        // Pause the contract
        vm.prank(owner);
        trashToken.pause();
        
        // Try to transfer when paused
        vm.prank(user1);
        vm.expectRevert();
        trashToken.transfer(user2, TRANSFER_AMOUNT);
        
        // Unpause
        vm.prank(owner);
        trashToken.unpause();
        
        // Should work now
        vm.prank(user1);
        trashToken.transfer(user2, TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test transferring all tokens
     */
    function testTransferAllTokens() public {
        // Transfer all tokens
        vm.prank(user1);
        trashToken.transfer(user2, MINT_AMOUNT);
        
        // Check balances
        assertEq(trashToken.balanceOf(user1), 0);
        assertEq(trashToken.balanceOf(user2), MINT_AMOUNT);
    }
    
    /**
     * @dev Test transferring multiple times
     */
    function testTransferMultipleTimes() public {
        // Transfer tokens multiple times
        vm.startPrank(user1);
        trashToken.transfer(user2, TRANSFER_AMOUNT / 2);
        trashToken.transfer(user2, TRANSFER_AMOUNT / 2);
        vm.stopPrank();
        
        // Check balances
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - TRANSFER_AMOUNT);
        assertEq(trashToken.balanceOf(user2), TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test transferring to self
     */
    function testTransferToSelf() public {
        // Transfer tokens to self
        vm.prank(user1);
        trashToken.transfer(user1, TRANSFER_AMOUNT);
        
        // Check balance
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT);
    }
    
    /**
     * @dev Test transferFrom
     */
    function testTransferFrom() public {
        // Approve owner to transfer tokens
        vm.prank(user1);
        trashToken.approve(owner, TRANSFER_AMOUNT);
        
        // Transfer tokens
        vm.prank(owner);
        trashToken.transferFrom(user1, user2, TRANSFER_AMOUNT);
        
        // Check balances
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - TRANSFER_AMOUNT);
        assertEq(trashToken.balanceOf(user2), TRANSFER_AMOUNT);
        
        // Check allowance
        assertEq(trashToken.allowance(user1, owner), 0);
    }
    
    /**
     * @dev Test transferFrom with insufficient allowance
     */
    function testTransferFromInsufficientAllowance() public {
        // Approve owner to transfer tokens
        vm.prank(user1);
        trashToken.approve(owner, TRANSFER_AMOUNT / 2);
        
        // Try to transfer more than allowed
        vm.prank(owner);
        vm.expectRevert();
        trashToken.transferFrom(user1, user2, TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test transferFrom with insufficient balance
     */
    function testTransferFromInsufficientBalance() public {
        // Approve owner to transfer tokens
        vm.prank(user1);
        trashToken.approve(owner, MINT_AMOUNT * 2);
        
        // Try to transfer more than balance
        vm.prank(owner);
        vm.expectRevert();
        trashToken.transferFrom(user1, user2, MINT_AMOUNT + 1);
    }
    
    /**
     * @dev Test transferFrom when paused
     */
    function testTransferFromWhenPaused() public {
        // Approve owner to transfer tokens
        vm.prank(user1);
        trashToken.approve(owner, TRANSFER_AMOUNT);
        
        // Pause the contract
        vm.prank(owner);
        trashToken.pause();
        
        // Try to transfer when paused
        vm.prank(owner);
        vm.expectRevert();
        trashToken.transferFrom(user1, user2, TRANSFER_AMOUNT);
        
        // Unpause
        vm.prank(owner);
        trashToken.unpause();
        
        // Should work now
        vm.prank(owner);
        trashToken.transferFrom(user1, user2, TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test transferFrom with unlimited allowance
     */
    function testTransferFromUnlimitedAllowance() public {
        // Approve owner to transfer unlimited tokens
        vm.prank(user1);
        trashToken.approve(owner, type(uint256).max);
        
        // Transfer tokens
        vm.prank(owner);
        trashToken.transferFrom(user1, user2, TRANSFER_AMOUNT);
        
        // Check balances
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - TRANSFER_AMOUNT);
        assertEq(trashToken.balanceOf(user2), TRANSFER_AMOUNT);
        
        // Check allowance (should still be unlimited)
        assertEq(trashToken.allowance(user1, owner), type(uint256).max);
    }
    
    /**
     * @dev Test transferFrom to zero address
     */
    function testTransferFromToZeroAddress() public {
        // Approve owner to transfer tokens
        vm.prank(user1);
        trashToken.approve(owner, TRANSFER_AMOUNT);
        
        // Try to transfer to zero address
        vm.prank(owner);
        vm.expectRevert();
        trashToken.transferFrom(user1, address(0), TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test transferFrom from zero address
     */
    function testTransferFromFromZeroAddress() public {
        // Try to transfer from zero address
        vm.prank(owner);
        vm.expectRevert();
        trashToken.transferFrom(address(0), user2, TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test batch transfer
     */
    function testBatchTransfer() public {
        // Set up recipients and amounts
        address[] memory recipients = new address[](3);
        recipients[0] = user2;
        recipients[1] = user3;
        recipients[2] = user4;
        
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = TRANSFER_AMOUNT / 4;
        amounts[1] = TRANSFER_AMOUNT / 2;
        amounts[2] = TRANSFER_AMOUNT / 4;
        
        // Batch transfer
        vm.prank(user1);
        trashToken.batchTransfer(recipients, amounts);
        
        // Check balances
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - TRANSFER_AMOUNT);
        assertEq(trashToken.balanceOf(user2), TRANSFER_AMOUNT / 4);
        assertEq(trashToken.balanceOf(user3), TRANSFER_AMOUNT / 2);
        assertEq(trashToken.balanceOf(user4), TRANSFER_AMOUNT / 4);
    }
    
    /**
     * @dev Test batch transfer with mismatched arrays
     */
    function testBatchTransferMismatchedArrays() public {
        // Set up recipients and amounts with different lengths
        address[] memory recipients = new address[](3);
        recipients[0] = user2;
        recipients[1] = user3;
        recipients[2] = user4;
        
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = TRANSFER_AMOUNT / 2;
        amounts[1] = TRANSFER_AMOUNT / 2;
        
        // Try to batch transfer with mismatched arrays
        vm.prank(user1);
        vm.expectRevert();
        trashToken.batchTransfer(recipients, amounts);
    }
}
