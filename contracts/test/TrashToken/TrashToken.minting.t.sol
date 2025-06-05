// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title TrashTokenMintingTest
 * @dev Tests for TrashToken minting functionality
 */
contract TrashTokenMintingTest is BaseTest {
    // Test constants
    uint256 constant MINT_AMOUNT = 1000 * 10**6; // 1,000 TRASH
    
    function setUp() public override {
        super.setUp();
        
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
    }
    
    /**
     * @dev Test minting tokens
     */
    function testMint() public {
        // Mint tokens
        vm.prank(owner);
        trashToken.mint(user1, MINT_AMOUNT);
        
        // Check balance
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT);
    }
    
    /**
     * @dev Test minting by authorized minter
     */
    function testMintByAuthorizedMinter() public {
        // Authorize a minter
        vm.prank(owner);
        trashToken.authorizeMinter(user1);
        
        // Mint tokens
        vm.prank(user1);
        trashToken.mint(user2, MINT_AMOUNT);
        
        // Check balance
        assertEq(trashToken.balanceOf(user2), MINT_AMOUNT);
    }
    
    /**
     * @dev Test minting by unauthorized minter
     */
    function testMintByUnauthorizedMinter() public {
        // Try to mint as unauthorized minter
        vm.prank(user1);
        vm.expectRevert();
        trashToken.mint(user2, MINT_AMOUNT);
    }
    
    /**
     * @dev Test minting with zero amount
     */
    function testMintZeroAmount() public {
        // Mint zero tokens - should revert with ZeroAmount
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(TrashToken.ZeroAmount.selector));
        trashToken.mint(user1, 0);
        
        // Check balance remains unchanged
        assertEq(trashToken.balanceOf(user1), 0);
        
        // Check total supply remains unchanged
        assertEq(trashToken.totalSupply(), 0);
    }
    
    /**
     * @dev Test minting to zero address
     */
    function testMintToZeroAddress() public {
        // Try to mint to zero address
        vm.prank(owner);
        vm.expectRevert();
        trashToken.mint(address(0), MINT_AMOUNT);
    }
    
    /**
     * @dev Test minting multiple times
     */
    function testMintMultipleTimes() public {
        // Mint tokens multiple times
        vm.startPrank(owner);
        trashToken.mint(user1, MINT_AMOUNT);
        trashToken.mint(user1, MINT_AMOUNT);
        trashToken.mint(user2, MINT_AMOUNT * 2);
        vm.stopPrank();
        
        // Check balances
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT * 2);
        assertEq(trashToken.balanceOf(user2), MINT_AMOUNT * 2);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT * 4);
    }
    
    /**
     * @dev Test minting when paused
     */
    function testMintWhenPaused() public {
        // Pause the contract
        vm.prank(owner);
        trashToken.pause();
        
        // Try to mint when paused
        vm.prank(owner);
        vm.expectRevert();
        trashToken.mint(user1, MINT_AMOUNT);
        
        // Unpause
        vm.prank(owner);
        trashToken.unpause();
        
        // Should work now
        vm.prank(owner);
        trashToken.mint(user1, MINT_AMOUNT);
    }
    
    /**
     * @dev Test minting maximum amount
     */
    function testMintMaximumAmount() public {
        // Mint maximum amount
        uint256 maxAmount = type(uint256).max;
        
        vm.prank(owner);
        trashToken.mint(user1, maxAmount);
        
        // Check balance
        assertEq(trashToken.balanceOf(user1), maxAmount);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), maxAmount);
    }
    
    /**
     * @dev Test minting overflow
     */
    function testMintOverflow() public {
        // Mint maximum amount
        uint256 maxAmount = type(uint256).max;
        
        vm.prank(owner);
        trashToken.mint(user1, maxAmount);
        
        // Try to mint more (should revert due to overflow)
        vm.prank(owner);
        vm.expectRevert();
        trashToken.mint(user1, 1);
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
        trashToken.batchMint(recipients, amounts);
        
        // Check balances
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT);
        assertEq(trashToken.balanceOf(user2), MINT_AMOUNT * 2);
        assertEq(trashToken.balanceOf(user3), MINT_AMOUNT * 3);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT * 6);
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
        trashToken.batchMint(recipients, amounts);
    }
    
    /**
     * @dev Test batch minting with zero address
     */
    function testBatchMintWithZeroAddress() public {
        // Set up recipients and amounts with zero address
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = address(0);
        recipients[2] = user3;
        
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = MINT_AMOUNT;
        amounts[1] = MINT_AMOUNT * 2;
        amounts[2] = MINT_AMOUNT * 3;
        
        // Try to batch mint with zero address
        vm.prank(owner);
        vm.expectRevert();
        trashToken.batchMint(recipients, amounts);
    }
    
    /**
     * @dev Test batch minting by unauthorized minter
     */
    function testBatchMintByUnauthorizedMinter() public {
        // Set up recipients and amounts
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = MINT_AMOUNT;
        amounts[1] = MINT_AMOUNT * 2;
        amounts[2] = MINT_AMOUNT * 3;
        
        // Try to batch mint as unauthorized minter
        vm.prank(user1);
        vm.expectRevert();
        trashToken.batchMint(recipients, amounts);
    }
    
    /**
     * @dev Test batch minting when paused
     */
    function testBatchMintWhenPaused() public {
        // Set up recipients and amounts
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = MINT_AMOUNT;
        amounts[1] = MINT_AMOUNT * 2;
        amounts[2] = MINT_AMOUNT * 3;
        
        // Pause the contract
        vm.prank(owner);
        trashToken.pause();
        
        // Try to batch mint when paused
        vm.prank(owner);
        vm.expectRevert();
        trashToken.batchMint(recipients, amounts);
        
        // Unpause
        vm.prank(owner);
        trashToken.unpause();
        
        // Should work now
        vm.prank(owner);
        trashToken.batchMint(recipients, amounts);
    }
}
