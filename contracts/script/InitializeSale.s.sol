// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/core/TrashGenesis.sol";
import "../src/interfaces/ITrashGenesis.sol";

/**
 * @title InitializeSale
 * @dev Comprehensive script for checking and initializing the TrashGenesis sale
 */
contract InitializeSale is Script {
    
    function run() public {
        // Get the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        // Get the TrashGenesis contract address
        address trashGenesisAddress = 0xB4b773cDd37FDe0D431a202378Cc54b388ac1776;
        
        console.log("=== TRASH GENESIS SALE INITIALIZATION ===");
        console.log("Deployer address:", deployerAddress);
        console.log("TrashGenesis address:", trashGenesisAddress);
        console.log("");
        
        TrashGenesis trashGenesis = TrashGenesis(trashGenesisAddress);
        
        // Check current contract state
        console.log("=== CURRENT CONTRACT STATE ===");
        console.log("Current phase:", uint8(trashGenesis.currentPhase()));
        console.log("ETH price USD (scaled by 1e8):", trashGenesis.ethPriceUSD());
        console.log("Owner address:", trashGenesis.owner());
        console.log("");
        
        // Test token calculation for 0.1 ETH BEFORE configuration
        console.log("=== TOKEN CALCULATION TEST (BEFORE) ===");
        uint256 testEthAmount = 0.1 ether;
        uint256 tokensBefore = trashGenesis.calculateTokenAmount(testEthAmount);
        console.log("Token amount for 0.1 ETH (before):", tokensBefore);
        console.log("");
        
        // Start the broadcast for configuration
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== CONFIGURING SALE PHASES ===");
        
        // Configure Private Phase
        // Private: $0.001 per token = 1000 (scaled by 1e6)
        console.log("Configuring Private phase...");
        trashGenesis.updatePhaseConfig(
            ITrashGenesis.SalePhase.Private,
            1000,                    // $0.001 per token (scaled by 1e6)
            75 ether,               // 75 ETH hard cap
            0.1 ether,              // 0.1 ETH min contribution
            5 ether                 // 5 ETH max contribution
        );
        
        // Configure Whitelist Phase
        // Whitelist: $0.0015 per token = 1500 (scaled by 1e6)
        console.log("Configuring Whitelist phase...");
        trashGenesis.updatePhaseConfig(
            ITrashGenesis.SalePhase.Whitelist,
            1500,                   // $0.0015 per token (scaled by 1e6)
            75 ether,               // 75 ETH hard cap
            0.1 ether,              // 0.1 ETH min contribution
            5 ether                 // 5 ETH max contribution
        );
        
        // Configure Public Phase
        // Public: $0.002 per token = 2000 (scaled by 1e6)
        console.log("Configuring Public phase...");
        trashGenesis.updatePhaseConfig(
            ITrashGenesis.SalePhase.Public,
            2000,                   // $0.002 per token (scaled by 1e6)
            75 ether,               // 75 ETH hard cap
            0.01 ether,             // 0.01 ETH min contribution
            5 ether                 // 5 ETH max contribution
        );
        
        // Start the Public phase
        // Duration: 30 days
        console.log("Starting Public phase...");
        trashGenesis.setPhase(
            ITrashGenesis.SalePhase.Public,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        console.log("Public phase started successfully!");
        console.log("");
        
        vm.stopBroadcast();
        
        // Final verification
        console.log("=== FINAL VERIFICATION ===");
        
        // Test calculation again
        console.log("=== FINAL TOKEN CALCULATION TEST ===");
        uint256 tokensAfter = trashGenesis.calculateTokenAmount(testEthAmount);
        console.log("Token amount for 0.1 ETH (after):", tokensAfter);
        
        // Expected calculation:
        // 0.1 ETH * $2500 (ETH price) = $250 USD
        // $250 / $0.002 per token = 125,000 tokens
        uint256 currentEthPrice = trashGenesis.ethPriceUSD();
        uint256 expectedAmount = (testEthAmount * currentEthPrice / 1e8) * 1e6 / 2000;
        console.log("Expected tokens:", expectedAmount);
        
        if (tokensAfter == expectedAmount) {
            console.log("Token calculation is CORRECT!");
        } else {
            console.log("Token calculation is INCORRECT!");
            console.log("Difference:", tokensAfter > expectedAmount ? tokensAfter - expectedAmount : expectedAmount - tokensAfter);
        }
        
        console.log("");
        console.log("=== SALE INITIALIZATION COMPLETE ===");
    }
}
