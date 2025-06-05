// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";
import "../../src/libraries/NFTSplitter.sol";

/**
 * @title NFTSplitterTest
 * @dev Tests for NFTSplitter library
 */
contract NFTSplitterTest is BaseTest {
    // Test contract to expose library functions
    NFTSplitterWrapper wrapper;
    
    // Test constants
    uint256 constant ORIGINAL_AMOUNT = 1000 * 10**6; // 1,000 USDC
    uint256 constant SPLIT_AMOUNT_1 = 400 * 10**6; // 400 USDC
    uint256 constant SPLIT_AMOUNT_2 = 600 * 10**6; // 600 USDC
    
    function setUp() public override {
        super.setUp();
        
        // Deploy wrapper contract
        wrapper = new NFTSplitterWrapper();
    }
    
    /**
     * @dev Test validating split amounts
     */
    function testValidateSplitAmounts() public {
        // Set up split amounts
        uint256[] memory splitAmounts = new uint256[](2);
        splitAmounts[0] = SPLIT_AMOUNT_1;
        splitAmounts[1] = SPLIT_AMOUNT_2;
        
        // Validate split amounts
        bool isValid = wrapper.validateSplitAmounts(ORIGINAL_AMOUNT, splitAmounts);
        
        // Check validation result
        assertTrue(isValid);
    }
    
    /**
     * @dev Test validating split amounts with insufficient total
     */
    function testValidateSplitAmountsInsufficientTotal() public {
        // Set up split amounts with insufficient total
        uint256[] memory splitAmounts = new uint256[](2);
        splitAmounts[0] = SPLIT_AMOUNT_1;
        splitAmounts[1] = SPLIT_AMOUNT_2 + 1; // Exceeds original amount
        
        // Validate split amounts - should revert with InvalidSplitIncrement
        vm.expectRevert(NFTSplitter.InvalidSplitIncrement.selector);
        wrapper.validateSplitAmountsInternal(ORIGINAL_AMOUNT, splitAmounts);
    }
    
    /**
     * @dev Test validating split amounts with excess total
     */
    function testValidateSplitAmountsExcessTotal() public {
        // Set up split amounts with excess total
        uint256[] memory splitAmounts = new uint256[](2);
        splitAmounts[0] = SPLIT_AMOUNT_1;
        splitAmounts[1] = SPLIT_AMOUNT_2 - 1; // Less than original amount
        
        // Validate split amounts - should revert with InvalidSplitIncrement
        vm.expectRevert(NFTSplitter.InvalidSplitIncrement.selector);
        wrapper.validateSplitAmountsInternal(ORIGINAL_AMOUNT, splitAmounts);
    }
    
    /**
     * @dev Test validating split amounts with empty array
     */
    function testValidateSplitAmountsEmptyArray() public {
        // Set up empty split amounts array
        uint256[] memory splitAmounts = new uint256[](0);
        
        // Validate split amounts - should revert with InvalidSplitCount
        vm.expectRevert(NFTSplitter.InvalidSplitCount.selector);
        wrapper.validateSplitAmountsInternal(ORIGINAL_AMOUNT, splitAmounts);
    }
    
    /**
     * @dev Test validating split amounts with single amount
     */
    function testValidateSplitAmountsSingleAmount() public {
        // Set up split amounts with single amount
        uint256[] memory splitAmounts = new uint256[](1);
        splitAmounts[0] = ORIGINAL_AMOUNT;
        
        // Validate split amounts - should revert with InvalidSplitCount
        vm.expectRevert(NFTSplitter.InvalidSplitCount.selector);
        wrapper.validateSplitAmountsInternal(ORIGINAL_AMOUNT, splitAmounts);
    }
    
    /**
     * @dev Test validating split amounts with multiple amounts
     */
    function testValidateSplitAmountsMultipleAmounts() public {
        // Set up split amounts with multiple amounts
        uint256[] memory splitAmounts = new uint256[](3);
        splitAmounts[0] = 300 * 10**6;
        splitAmounts[1] = 300 * 10**6;
        splitAmounts[2] = 400 * 10**6;
        
        // Validate split amounts
        bool isValid = wrapper.validateSplitAmounts(ORIGINAL_AMOUNT, splitAmounts);
        
        // Check validation result
        assertTrue(isValid);
    }
    
    /**
     * @dev Test validating split amounts with zero amount
     */
    function testValidateSplitAmountsZeroAmount() public {
        // Set up split amounts with zero amount
        uint256[] memory splitAmounts = new uint256[](2);
        splitAmounts[0] = 0;
        splitAmounts[1] = ORIGINAL_AMOUNT;
        
        // Validate split amounts - should revert with ZeroSplitAmount
        vm.expectRevert(NFTSplitter.ZeroSplitAmount.selector);
        wrapper.validateSplitAmountsInternal(ORIGINAL_AMOUNT, splitAmounts);
    }
    
    /**
     * @dev Test validating split amounts with all zero amounts
     */
    function testValidateSplitAmountsAllZeroAmounts() public {
        // Set up split amounts with all zero amounts
        uint256[] memory splitAmounts = new uint256[](2);
        splitAmounts[0] = 0;
        splitAmounts[1] = 0;
        
        // This is a special case in the library that doesn't revert
        bool isValid = wrapper.validateSplitAmounts(0, splitAmounts);
        assertTrue(isValid);
    }
    
    /**
     * @dev Test validating merge amounts
     */
    function testValidateMergeAmounts() public {
        // Set up merge amounts
        uint256[] memory mergeAmounts = new uint256[](2);
        mergeAmounts[0] = SPLIT_AMOUNT_1;
        mergeAmounts[1] = SPLIT_AMOUNT_2;
        
        // Validate merge amounts
        uint256 totalAmount = wrapper.validateMergeAmounts(mergeAmounts);
        
        // Check total amount
        assertEq(totalAmount, ORIGINAL_AMOUNT);
    }
    
    /**
     * @dev Test validating merge amounts with empty array
     */
    function testValidateMergeAmountsEmptyArray() public {
        // Set up empty merge amounts array
        uint256[] memory mergeAmounts = new uint256[](0);
        
        // Validate merge amounts
        uint256 totalAmount = wrapper.validateMergeAmounts(mergeAmounts);
        
        // Check total amount
        assertEq(totalAmount, 0);
    }
    
    /**
     * @dev Test validating merge amounts with single amount
     */
    function testValidateMergeAmountsSingleAmount() public {
        // Set up merge amounts with single amount
        uint256[] memory mergeAmounts = new uint256[](1);
        mergeAmounts[0] = ORIGINAL_AMOUNT;
        
        // Validate merge amounts
        uint256 totalAmount = wrapper.validateMergeAmounts(mergeAmounts);
        
        // Check total amount
        assertEq(totalAmount, ORIGINAL_AMOUNT);
    }
    
    /**
     * @dev Test validating merge amounts with multiple amounts
     */
    function testValidateMergeAmountsMultipleAmounts() public {
        // Set up merge amounts with multiple amounts
        uint256[] memory mergeAmounts = new uint256[](3);
        mergeAmounts[0] = 300 * 10**6;
        mergeAmounts[1] = 300 * 10**6;
        mergeAmounts[2] = 400 * 10**6;
        
        // Validate merge amounts
        uint256 totalAmount = wrapper.validateMergeAmounts(mergeAmounts);
        
        // Check total amount
        assertEq(totalAmount, ORIGINAL_AMOUNT);
    }
    
    /**
     * @dev Test validating merge amounts with zero amount
     */
    function testValidateMergeAmountsZeroAmount() public {
        // Set up merge amounts with zero amount
        uint256[] memory mergeAmounts = new uint256[](2);
        mergeAmounts[0] = 0;
        mergeAmounts[1] = ORIGINAL_AMOUNT;
        
        // Validate merge amounts
        uint256 totalAmount = wrapper.validateMergeAmounts(mergeAmounts);
        
        // Check total amount
        assertEq(totalAmount, ORIGINAL_AMOUNT);
    }
    
    /**
     * @dev Test validating merge amounts with all zero amounts
     */
    function testValidateMergeAmountsAllZeroAmounts() public {
        // Set up merge amounts with all zero amounts
        uint256[] memory mergeAmounts = new uint256[](2);
        mergeAmounts[0] = 0;
        mergeAmounts[1] = 0;
        
        // Validate merge amounts
        uint256 totalAmount = wrapper.validateMergeAmounts(mergeAmounts);
        
        // Check total amount
        assertEq(totalAmount, 0);
    }
    
    /**
     * @dev Test calculating split token IDs
     */
    function testCalculateSplitTokenIds() public {
        // Calculate split token IDs
        uint256 originalTokenId = 123;
        uint256[] memory splitTokenIds = wrapper.calculateSplitTokenIds(originalTokenId, 2);
        
        // Check split token IDs
        assertEq(splitTokenIds.length, 2);
        assertEq(splitTokenIds[0], originalTokenId * 10 + 1);
        assertEq(splitTokenIds[1], originalTokenId * 10 + 2);
    }
    
    /**
     * @dev Test calculating split token IDs with large count
     */
    function testCalculateSplitTokenIdsLargeCount() public {
        // Calculate split token IDs with large count
        uint256 originalTokenId = 123;
        uint256 count = 10;
        uint256[] memory splitTokenIds = wrapper.calculateSplitTokenIds(originalTokenId, count);
        
        // Check split token IDs
        assertEq(splitTokenIds.length, count);
        for (uint256 i = 0; i < count; i++) {
            assertEq(splitTokenIds[i], originalTokenId * 10 + i + 1);
        }
    }
    
    /**
     * @dev Test calculating split token IDs with zero count
     */
    function testCalculateSplitTokenIdsZeroCount() public {
        // Calculate split token IDs with zero count
        uint256 originalTokenId = 123;
        uint256[] memory splitTokenIds = wrapper.calculateSplitTokenIds(originalTokenId, 0);
        
        // Check split token IDs
        assertEq(splitTokenIds.length, 0);
    }
    
    /**
     * @dev Test calculating parent token ID
     */
    function testCalculateParentTokenId() public {
        // Calculate parent token ID
        uint256 childTokenId = 1234;
        uint256 parentTokenId = wrapper.calculateParentTokenId(childTokenId);
        
        // Check parent token ID
        assertEq(parentTokenId, 123);
    }
    
    /**
     * @dev Test calculating parent token ID with single digit
     */
    function testCalculateParentTokenIdSingleDigit() public {
        // Calculate parent token ID with single digit
        uint256 childTokenId = 5;
        uint256 parentTokenId = wrapper.calculateParentTokenId(childTokenId);
        
        // Check parent token ID
        assertEq(parentTokenId, 0);
    }
    
    /**
     * @dev Test calculating parent token ID with large number
     */
    function testCalculateParentTokenIdLargeNumber() public {
        // Calculate parent token ID with large number
        uint256 childTokenId = 12345678901;
        uint256 parentTokenId = wrapper.calculateParentTokenId(childTokenId);
        
        // Check parent token ID
        assertEq(parentTokenId, 1234567890);
    }
    
    /**
     * @dev Test is child token
     */
    function testIsChildToken() public {
        // Check if token is a child token
        uint256 parentTokenId = 123;
        uint256 childTokenId = 1234;
        bool isChild = wrapper.isChildToken(parentTokenId, childTokenId);
        
        // Check result
        assertTrue(isChild);
    }
    
    /**
     * @dev Test is child token with non-child
     */
    function testIsChildTokenWithNonChild() public {
        // Check if token is a child token with non-child
        uint256 parentTokenId = 123;
        uint256 nonChildTokenId = 456; // Not a child of 123
        bool isChild = wrapper.isChildToken(parentTokenId, nonChildTokenId);
        
        // Check result
        assertFalse(isChild);
    }
    
    /**
     * @dev Test is child token with same token
     */
    function testIsChildTokenWithSameToken() public {
        // Check if token is a child token with same token
        uint256 tokenId = 123;
        bool isChild = wrapper.isChildToken(tokenId, tokenId);
        
        // Check result
        assertFalse(isChild);
    }
}

/**
 * @title NFTSplitterWrapper
 * @dev Wrapper contract to expose NFTSplitter library functions for testing
 */
contract NFTSplitterWrapper {
    function validateSplitAmounts(uint256 originalAmount, uint256[] memory splitAmounts) public view returns (bool) {
        try this.validateSplitAmountsInternal(originalAmount, splitAmounts) {
            return true;
        } catch {
            return false;
        }
    }
    
    function validateSplitAmountsInternal(uint256 originalAmount, uint256[] memory splitAmounts) public view {
        NFTSplitter.validateSplitAmounts(originalAmount, splitAmounts);
    }
    
    function validateMergeAmounts(uint256[] memory mergeAmounts) public pure returns (uint256) {
        return NFTSplitter.validateMergeAmounts(mergeAmounts);
    }
    
    function calculateSplitTokenIds(uint256 originalTokenId, uint256 count) public pure returns (uint256[] memory) {
        return NFTSplitter.calculateSplitTokenIds(originalTokenId, count);
    }
    
    function calculateParentTokenId(uint256 childTokenId) public pure returns (uint256) {
        return NFTSplitter.calculateParentTokenId(childTokenId);
    }
    
    function isChildToken(uint256 parentTokenId, uint256 childTokenId) public pure returns (bool) {
        return NFTSplitter.isChildToken(parentTokenId, childTokenId);
    }
}
