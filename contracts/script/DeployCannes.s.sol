// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/cannes/GreenGuardians.sol";
import "../src/cannes/CannesGame.sol";
import "../src/cannes/CannesViews.sol";

/**
 * @title DeployCannes
 * @dev Script for deploying the Cannes event contracts
 */
contract DeployCannes is Script {
    
    // Contract instances
    GreenGuardians public greenGuardians;
    CannesGame public cannesGame;
    CannesViews public cannesViews;
    
    // Deployment addresses
    address public deployerAddress;
    address public greenGuardiansAddress;
    address public cannesGameAddress;
    address public cannesViewsAddress;
    
    function run() public {
        // Get the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployerAddress = vm.addr(deployerPrivateKey);
        
        console.log("Deployer address:", deployerAddress);
        console.log("Deploying Cannes contracts...");
        
        // Start the deployment
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy contracts
        deployGreenGuardians();
        deployCannesGame();
        deployCannesViews();
        
        // Configure contracts for Pragma event (July 3rd, 2025)
        configureForPragmaEvent();
        
        vm.stopBroadcast();
        
        // Log all deployed contract addresses
        logDeployedAddresses();
        
        // Generate TypeScript config
        generateTypeScriptConfig();
    }
    
    /**
     * @dev Deploy GreenGuardians contract
     */
    function deployGreenGuardians() internal {
        console.log("Deploying GreenGuardians...");
        greenGuardians = new GreenGuardians(deployerAddress);
        greenGuardiansAddress = address(greenGuardians);
        console.log("GreenGuardians deployed at:", greenGuardiansAddress);
    }
    
    /**
     * @dev Deploy CannesGame contract
     */
    function deployCannesGame() internal {
        console.log("Deploying CannesGame...");
        cannesGame = new CannesGame(deployerAddress);
        cannesGameAddress = address(cannesGame);
        console.log("CannesGame deployed at:", cannesGameAddress);
    }
    
    /**
     * @dev Deploy CannesViews contract
     */
    function deployCannesViews() internal {
        console.log("Deploying CannesViews...");
        cannesViews = new CannesViews(greenGuardiansAddress, cannesGameAddress);
        cannesViewsAddress = address(cannesViews);
        console.log("CannesViews deployed at:", cannesViewsAddress);
    }
    
    /**
     * @dev Configure contracts for Pragma event
     */
    function configureForPragmaEvent() internal {
        console.log("Configuring for Pragma event (July 3rd, 2025)...");
        
        // July 3rd, 2025 - 24 hour event
        uint256 pragmaStart = 1751673600; // July 3rd, 2025 00:00:00 UTC
        uint256 pragmaEnd = 1751760000;   // July 4th, 2025 00:00:00 UTC
        
        // Configure the event
        cannesGame.configureEvent(pragmaStart, pragmaEnd);
        
        console.log("Pragma event configured:");
        console.log("Start:", pragmaStart);
        console.log("End:", pragmaEnd);
    }
    
    /**
     * @dev Log all deployed contract addresses
     */
    function logDeployedAddresses() internal view {
        console.log("\n--- Cannes Contract Addresses ---");
        console.log("GreenGuardians:", greenGuardiansAddress);
        console.log("CannesGame:", cannesGameAddress);
        console.log("CannesViews:", cannesViewsAddress);
        console.log("Deployer (Admin):", deployerAddress);
        console.log("----------------------------------\n");
    }
    
    /**
     * @dev Generate TypeScript configuration file
     */
    function generateTypeScriptConfig() internal view {
        console.log("TypeScript Config:");
        console.log("export const cannesContracts = {");
        console.log('  greenGuardians: "%s",', greenGuardiansAddress);
        console.log('  cannesGame: "%s",', cannesGameAddress);
        console.log('  cannesViews: "%s",', cannesViewsAddress);
        console.log("};");
        console.log("");
        console.log("export const cannesConfig = {");
        console.log('  adminAddress: "%s",', deployerAddress);
        console.log('  network: "Avalanche Fuji Testnet",');
        console.log('  chainId: 43113,');
        console.log("};");
    }
}
