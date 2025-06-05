// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title TrashTokenBurningTest
 * @dev Tests for TrashToken burning functionality
 */
contract TrashTokenBurningTest is BaseTest {
    // Test constants
    uint256 constant MINT_AMOUNT = 1000 * 10**6; // 1,000 TRASH
    uint256 constant BURN_AMOUNT = 400 * 10**6; // 400 TRASH
    
    function setUp() public override {
        super.setUp();
        
        // Deploy TrashToken
        trashToken = new TrashToken(owner);
        
        // Mint tokens
        vm.prank(owner);
        trashToken.mint(user1, MINT_AMOUNT);
    }
    
    /**
     * @dev Test burning tokens
     */
    function testBurn() public {
        // Check initial balance
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT);
        
        // Burn tokens
        vm.prank(user1);
        trashToken.burn(BURN_AMOUNT);
        
        // Check balance after burning
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - BURN_AMOUNT);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT - BURN_AMOUNT);
    }
    
    /**
     * @dev Test burning tokens by authorized burner
     */
    function testBurnByAuthorizedBurner() public {
        // Approve owner to burn tokens
        vm.prank(user1);
        trashToken.approve(owner, BURN_AMOUNT);
        
        // Burn tokens
        vm.prank(owner);
        trashToken.burnFrom(user1, BURN_AMOUNT);
        
        // Check balance after burning
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - BURN_AMOUNT);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT - BURN_AMOUNT);
    }
    
    /**
     * @dev Test burning tokens by unauthorized burner
     */
    function testBurnByUnauthorizedBurner() public {
        // Try to burn tokens without approval
        vm.prank(owner);
        vm.expectRevert();
        trashToken.burnFrom(user1, BURN_AMOUNT);
    }
    
    /**
     * @dev Test burning with insufficient balance
     */
    function testBurnInsufficientBalance() public {
        // Try to burn more tokens than balance
        vm.prank(user1);
        vm.expectRevert();
        trashToken.burn(MINT_AMOUNT + 1);
    }
    
    /**
     * @dev Test burning zero tokens
     */
    function testBurnZeroTokens() public {
        // Burn zero tokens - should revert with ZeroAmount
        vm.prank(user1);
        vm.expectRevert(TrashToken.ZeroAmount.selector);
        trashToken.burn(0);
        
        // Check balance remains unchanged
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT);
        
        // Check total supply remains unchanged
        assertEq(trashToken.totalSupply(), MINT_AMOUNT);
    }
    
    /**
     * @dev Test burning when paused
     */
    function testBurnWhenPaused() public {
        // Pause the contract
        vm.prank(owner);
        trashToken.pause();
        
        // Try to burn when paused
        vm.prank(user1);
        vm.expectRevert();
        trashToken.burn(BURN_AMOUNT);
        
        // Unpause
        vm.prank(owner);
        trashToken.unpause();
        
        // Should work now
        vm.prank(user1);
        trashToken.burn(BURN_AMOUNT);
    }
    
    /**
     * @dev Test burning from when paused
     */
    function testBurnFromWhenPaused() public {
        // Approve owner to burn tokens
        vm.prank(user1);
        trashToken.approve(owner, BURN_AMOUNT);
        
        // Pause the contract
        vm.prank(owner);
        trashToken.pause();
        
        // Try to burn from when paused
        vm.prank(owner);
        vm.expectRevert();
        trashToken.burnFrom(user1, BURN_AMOUNT);
        
        // Unpause
        vm.prank(owner);
        trashToken.unpause();
        
        // Should work now
        vm.prank(owner);
        trashToken.burnFrom(user1, BURN_AMOUNT);
    }
    
    /**
     * @dev Test burning all tokens
     */
    function testBurnAllTokens() public {
        // Burn all tokens
        vm.prank(user1);
        trashToken.burn(MINT_AMOUNT);
        
        // Check balance
        assertEq(trashToken.balanceOf(user1), 0);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), 0);
    }
    
    /**
     * @dev Test burning multiple times
     */
    function testBurnMultipleTimes() public {
        // Burn tokens multiple times
        vm.startPrank(user1);
        trashToken.burn(BURN_AMOUNT / 2);
        trashToken.burn(BURN_AMOUNT / 2);
        vm.stopPrank();
        
        // Check balance
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - BURN_AMOUNT);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT - BURN_AMOUNT);
    }
    
    /**
     * @dev Test burning from with partial approval
     */
    function testBurnFromPartialApproval() public {
        // Approve owner to burn tokens
        vm.prank(user1);
        trashToken.approve(owner, BURN_AMOUNT / 2);
        
        // Try to burn more than approved
        vm.prank(owner);
        vm.expectRevert();
        trashToken.burnFrom(user1, BURN_AMOUNT);
        
        // Burn approved amount
        vm.prank(owner);
        trashToken.burnFrom(user1, BURN_AMOUNT / 2);
        
        // Check balance
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - BURN_AMOUNT / 2);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT - BURN_AMOUNT / 2);
    }
    
    /**
     * @dev Test burning from with unlimited approval
     */
    function testBurnFromUnlimitedApproval() public {
        // Approve owner to burn unlimited tokens
        vm.prank(user1);
        trashToken.approve(owner, type(uint256).max);
        
        // Burn tokens
        vm.prank(owner);
        trashToken.burnFrom(user1, BURN_AMOUNT);
        
        // Check balance
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - BURN_AMOUNT);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT - BURN_AMOUNT);
        
        // Check remaining allowance - should still be max value
        // This is how ERC20 works - it doesn't decrease the allowance for unlimited approval
        assertEq(trashToken.allowance(user1, owner), type(uint256).max);
    }
    
    /**
     * @dev Test burning from with exact approval
     */
    function testBurnFromExactApproval() public {
        // Approve owner to burn exact amount
        vm.prank(user1);
        trashToken.approve(owner, BURN_AMOUNT);
        
        // Burn tokens
        vm.prank(owner);
        trashToken.burnFrom(user1, BURN_AMOUNT);
        
        // Check balance
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - BURN_AMOUNT);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT - BURN_AMOUNT);
        
        // Check remaining allowance
        assertEq(trashToken.allowance(user1, owner), 0);
    }
    
    /**
     * @dev Test multiple burns
     */
    function testMultipleBurns() public {
        // Mint tokens to multiple users
        vm.startPrank(owner);
        trashToken.mint(user2, MINT_AMOUNT);
        trashToken.mint(user3, MINT_AMOUNT);
        vm.stopPrank();
        
        // Burn tokens directly by each user
        vm.prank(user1);
        trashToken.burn(BURN_AMOUNT);
        
        vm.prank(user2);
        trashToken.burn(BURN_AMOUNT);
        
        vm.prank(user3);
        trashToken.burn(BURN_AMOUNT);
        
        // Check balances
        assertEq(trashToken.balanceOf(user1), MINT_AMOUNT - BURN_AMOUNT);
        assertEq(trashToken.balanceOf(user2), MINT_AMOUNT - BURN_AMOUNT);
        assertEq(trashToken.balanceOf(user3), MINT_AMOUNT - BURN_AMOUNT);
        
        // Check total supply
        assertEq(trashToken.totalSupply(), MINT_AMOUNT * 3 - BURN_AMOUNT * 3);
    }
}
