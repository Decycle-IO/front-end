// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title TestUSDCTest
 * @dev Tests for TestUSDC mock contract
 */
contract TestUSDCTest is BaseTest {
    // Test constants
    uint256 constant MINT_AMOUNT = 1000 * 10**6; // 1,000 USDC
    uint256 constant TRANSFER_AMOUNT = 400 * 10**6; // 400 USDC
    
    function setUp() public override {
        super.setUp();
        
        // Deploy TestUSDC
        usdcToken = new TestUSDC(owner);
    }
    
    /**
     * @dev Test constructor and initial state
     */
    function testConstructor() public {
        // Check owner
        assertEq(usdcToken.owner(), owner);
        
        // Check initial supply
        assertEq(usdcToken.totalSupply(), 0);
    }
    
    /**
     * @dev Test constructor with zero address for owner
     */
    function testConstructorZeroAddressOwner() public {
        vm.expectRevert();
        new TestUSDC(address(0));
    }
    
    /**
     * @dev Test token name and symbol
     */
    function testNameAndSymbol() public {
        // Check name and symbol
        assertEq(usdcToken.name(), "Test USDC");
        assertEq(usdcToken.symbol(), "tUSDC");
    }
    
    /**
     * @dev Test token decimals
     */
    function testDecimals() public {
        // Check decimals
        assertEq(usdcToken.decimals(), 6);
    }
    
    /**
     * @dev Test minting tokens
     */
    function testMint() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Check balance
        assertEq(usdcToken.balanceOf(user1), MINT_AMOUNT);
        
        // Check total supply
        assertEq(usdcToken.totalSupply(), MINT_AMOUNT);
    }
    
    /**
     * @dev Test minting by non-owner
     */
    function testMintByNonOwner() public {
        // Try to mint as non-owner
        vm.prank(user1);
        vm.expectRevert();
        usdcToken.mint(user2, MINT_AMOUNT);
    }
    
    /**
     * @dev Test minting to zero address
     */
    function testMintToZeroAddress() public {
        // Try to mint to zero address
        vm.prank(owner);
        vm.expectRevert();
        usdcToken.mint(address(0), MINT_AMOUNT);
    }
    
    /**
     * @dev Test minting zero amount
     */
    function testMintZeroAmount() public {
        // Mint zero tokens
        vm.prank(owner);
        usdcToken.mint(user1, 0);
        
        // Check balance
        assertEq(usdcToken.balanceOf(user1), 0);
        
        // Check total supply
        assertEq(usdcToken.totalSupply(), 0);
    }
    
    /**
     * @dev Test transferring tokens
     */
    function testTransfer() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Transfer tokens
        vm.prank(user1);
        usdcToken.transfer(user2, TRANSFER_AMOUNT);
        
        // Check balances
        assertEq(usdcToken.balanceOf(user1), MINT_AMOUNT - TRANSFER_AMOUNT);
        assertEq(usdcToken.balanceOf(user2), TRANSFER_AMOUNT);
        
        // Check total supply
        assertEq(usdcToken.totalSupply(), MINT_AMOUNT);
    }
    
    /**
     * @dev Test transferring with insufficient balance
     */
    function testTransferInsufficientBalance() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Try to transfer more than balance
        vm.prank(user1);
        vm.expectRevert();
        usdcToken.transfer(user2, MINT_AMOUNT + 1);
    }
    
    /**
     * @dev Test transferring to zero address
     */
    function testTransferToZeroAddress() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Try to transfer to zero address
        vm.prank(user1);
        vm.expectRevert();
        usdcToken.transfer(address(0), TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test approving and transferring
     */
    function testApproveAndTransferFrom() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Approve user2 to spend tokens
        vm.prank(user1);
        usdcToken.approve(user2, TRANSFER_AMOUNT);
        
        // Check allowance
        assertEq(usdcToken.allowance(user1, user2), TRANSFER_AMOUNT);
        
        // Transfer tokens
        vm.prank(user2);
        usdcToken.transferFrom(user1, user3, TRANSFER_AMOUNT);
        
        // Check balances
        assertEq(usdcToken.balanceOf(user1), MINT_AMOUNT - TRANSFER_AMOUNT);
        assertEq(usdcToken.balanceOf(user3), TRANSFER_AMOUNT);
        
        // Check allowance after transfer
        assertEq(usdcToken.allowance(user1, user2), 0);
    }
    
    /**
     * @dev Test transferFrom with insufficient allowance
     */
    function testTransferFromInsufficientAllowance() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Approve user2 to spend tokens
        vm.prank(user1);
        usdcToken.approve(user2, TRANSFER_AMOUNT / 2);
        
        // Try to transfer more than allowed
        vm.prank(user2);
        vm.expectRevert();
        usdcToken.transferFrom(user1, user3, TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test transferFrom with unlimited allowance
     */
    function testTransferFromUnlimitedAllowance() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Approve user2 to spend unlimited tokens
        vm.prank(user1);
        usdcToken.approve(user2, type(uint256).max);
        
        // Transfer tokens
        vm.prank(user2);
        usdcToken.transferFrom(user1, user3, TRANSFER_AMOUNT);
        
        // Check balances
        assertEq(usdcToken.balanceOf(user1), MINT_AMOUNT - TRANSFER_AMOUNT);
        assertEq(usdcToken.balanceOf(user3), TRANSFER_AMOUNT);
        
        // Check allowance after transfer (should still be unlimited)
        assertEq(usdcToken.allowance(user1, user2), type(uint256).max);
    }
    
    /**
     * @dev Test burning tokens
     */
    function testBurn() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Burn tokens
        vm.prank(user1);
        usdcToken.burn(TRANSFER_AMOUNT);
        
        // Check balance
        assertEq(usdcToken.balanceOf(user1), MINT_AMOUNT - TRANSFER_AMOUNT);
        
        // Check total supply
        assertEq(usdcToken.totalSupply(), MINT_AMOUNT - TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test burning with insufficient balance
     */
    function testBurnInsufficientBalance() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Try to burn more than balance
        vm.prank(user1);
        vm.expectRevert();
        usdcToken.burn(MINT_AMOUNT + 1);
    }
    
    /**
     * @dev Test burning from another account
     */
    function testBurnFrom() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Approve user2 to burn tokens
        vm.prank(user1);
        usdcToken.approve(user2, TRANSFER_AMOUNT);
        
        // Burn tokens
        vm.prank(user2);
        usdcToken.burnFrom(user1, TRANSFER_AMOUNT);
        
        // Check balance
        assertEq(usdcToken.balanceOf(user1), MINT_AMOUNT - TRANSFER_AMOUNT);
        
        // Check total supply
        assertEq(usdcToken.totalSupply(), MINT_AMOUNT - TRANSFER_AMOUNT);
        
        // Check allowance after burn
        assertEq(usdcToken.allowance(user1, user2), 0);
    }
    
    /**
     * @dev Test burnFrom with insufficient allowance
     */
    function testBurnFromInsufficientAllowance() public {
        // Mint tokens
        vm.prank(owner);
        usdcToken.mint(user1, MINT_AMOUNT);
        
        // Approve user2 to burn tokens
        vm.prank(user1);
        usdcToken.approve(user2, TRANSFER_AMOUNT / 2);
        
        // Try to burn more than allowed
        vm.prank(user2);
        vm.expectRevert();
        usdcToken.burnFrom(user1, TRANSFER_AMOUNT);
    }
    
    /**
     * @dev Test batch minting
     */
    function testBatchMint() public {
        // Set up recipients and amounts
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = MINT_AMOUNT;
        amounts[1] = MINT_AMOUNT * 2;
        amounts[2] = MINT_AMOUNT * 3;
        
        // Batch mint
        vm.prank(owner);
        usdcToken.batchMint(recipients, amounts);
        
        // Check balances
        assertEq(usdcToken.balanceOf(user1), MINT_AMOUNT);
        assertEq(usdcToken.balanceOf(user2), MINT_AMOUNT * 2);
        assertEq(usdcToken.balanceOf(user3), MINT_AMOUNT * 3);
        
        // Check total supply
        assertEq(usdcToken.totalSupply(), MINT_AMOUNT * 6);
    }
    
    /**
     * @dev Test batch minting with mismatched arrays
     */
    function testBatchMintMismatchedArrays() public {
        // Set up recipients and amounts with different lengths
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = MINT_AMOUNT;
        amounts[1] = MINT_AMOUNT * 2;
        
        // Try to batch mint with mismatched arrays
        vm.prank(owner);
        vm.expectRevert();
        usdcToken.batchMint(recipients, amounts);
    }
    
    /**
     * @dev Test batch minting by non-owner
     */
    function testBatchMintByNonOwner() public {
        // Set up recipients and amounts
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = MINT_AMOUNT;
        amounts[1] = MINT_AMOUNT * 2;
        amounts[2] = MINT_AMOUNT * 3;
        
        // Try to batch mint as non-owner
        vm.prank(user1);
        vm.expectRevert();
        usdcToken.batchMint(recipients, amounts);
    }
    
    /**
     * @dev Test transferring ownership
     */
    function testTransferOwnership() public {
        // Transfer ownership
        vm.prank(owner);
        usdcToken.transferOwnership(user1);
        
        // Check new owner
        assertEq(usdcToken.owner(), user1);
        
        // Check that old owner can no longer perform owner actions
        vm.prank(owner);
        vm.expectRevert();
        usdcToken.mint(user2, MINT_AMOUNT);
        
        // Check that new owner can perform owner actions
        vm.prank(user1);
        usdcToken.mint(user2, MINT_AMOUNT);
        assertEq(usdcToken.balanceOf(user2), MINT_AMOUNT);
    }
    
    /**
     * @dev Test transferring ownership by non-owner
     */
    function testTransferOwnershipByNonOwner() public {
        // Try to transfer ownership as non-owner
        vm.prank(user1);
        vm.expectRevert();
        usdcToken.transferOwnership(user2);
    }
    
    /**
     * @dev Test transferring ownership to zero address
     */
    function testTransferOwnershipToZeroAddress() public {
        // Try to transfer ownership to zero address
        vm.prank(owner);
        vm.expectRevert();
        usdcToken.transferOwnership(address(0));
    }
}
