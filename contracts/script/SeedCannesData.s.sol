// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/cannes/GreenGuardians.sol";
import "../src/cannes/CannesGame.sol";

/**
 * @title SeedCannesData
 * @dev Script for seeding Cannes contracts with test data
 */
contract SeedCannesData is Script {
    
    // Contract addresses (to be set via environment variables or hardcoded)
    address public greenGuardiansAddress;
    address public cannesGameAddress;
    
    GreenGuardians public greenGuardians;
    CannesGame public cannesGame;
    
    // Test addresses for seeding
    address[] public testAddresses;
    
    function run() public {
        // Get contract addresses from environment or use defaults
        try vm.envAddress("GREEN_GUARDIANS_ADDRESS") returns (address addr) {
            greenGuardiansAddress = addr;
        } catch {
            revert("GREEN_GUARDIANS_ADDRESS not set");
        }
        
        try vm.envAddress("CANNES_GAME_ADDRESS") returns (address addr) {
            cannesGameAddress = addr;
        } catch {
            revert("CANNES_GAME_ADDRESS not set");
        }
        
        // Initialize contracts
        greenGuardians = GreenGuardians(greenGuardiansAddress);
        cannesGame = CannesGame(cannesGameAddress);
        
        // Get deployer private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        console.log("Seeding data for Cannes contracts...");
        console.log("GreenGuardians:", greenGuardiansAddress);
        console.log("CannesGame:", cannesGameAddress);
        console.log("Deployer:", deployerAddress);
        
        // Generate test addresses
        generateTestAddresses();
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Seed Green Guardians data
        seedGuardianData();
        
        // Seed game data
        seedGameData();
        
        // Seed NFC mappings
        seedNfcMappings();
        
        vm.stopBroadcast();
        
        console.log("Seeding completed!");
    }
    
    /**
     * @dev Generate test addresses for seeding
     */
    function generateTestAddresses() internal {
        // Generate 20 test addresses
        for (uint256 i = 1; i <= 20; i++) {
            address testAddr = vm.addr(i + 1000); // Use deterministic private keys
            testAddresses.push(testAddr);
        }
        
        console.log("Generated", testAddresses.length, "test addresses");
    }
    
    /**
     * @dev Seed Guardian donation data
     */
    function seedGuardianData() internal {
        console.log("Seeding Guardian data...");
        
        string[10] memory names = [
            "Alex Thompson",
            "Sophia Chen", 
            "Marcus Johnson",
            "Elena Rodriguez",
            "David Park",
            "Jamie Wilson",
            "Sarah Kim",
            "Michael Brown",
            "Lisa Wang",
            "Chris Taylor"
        ];
        
        string[10] memory avatars = [
            "https://i.pravatar.cc/150?img=33",
            "https://i.pravatar.cc/150?img=47",
            "https://i.pravatar.cc/150?img=15",
            "https://i.pravatar.cc/150?img=25",
            "https://i.pravatar.cc/150?img=11",
            "https://i.pravatar.cc/150?img=12",
            "https://i.pravatar.cc/150?img=44",
            "https://i.pravatar.cc/150?img=68",
            "https://i.pravatar.cc/150?img=32",
            "https://i.pravatar.cc/150?img=19"
        ];
        
        // Create donations with varying amounts
        uint256[10] memory donationAmounts;
        donationAmounts[0] = 5.5 ether;
        donationAmounts[1] = 3.2 ether;
        donationAmounts[2] = 2.1 ether;
        donationAmounts[3] = 1.8 ether;
        donationAmounts[4] = 0.8 ether;
        donationAmounts[5] = 0.5 ether;
        donationAmounts[6] = 1.2 ether;
        donationAmounts[7] = 2.5 ether;
        donationAmounts[8] = 0.3 ether;
        donationAmounts[9] = 4.1 ether;
        
        for (uint256 i = 0; i < 10; i++) {
            address guardian = testAddresses[i];
            
            // Send ETH to the guardian address first
            vm.deal(guardian, donationAmounts[i] + 1 ether);
            
            // Make donation
            vm.prank(guardian);
            greenGuardians.donate{value: donationAmounts[i]}();
            
            // Set profile
            vm.prank(guardian);
            greenGuardians.setGuardianProfile(names[i], avatars[i]);
            
            console.log("Created guardian:", names[i]);
        }
    }
    
    /**
     * @dev Seed game recycling data
     */
    function seedGameData() internal {
        console.log("Seeding Game data...");
        
        // Create recycling activities for various users
        address[] memory players = new address[](15);
        for (uint256 i = 0; i < 15; i++) {
            players[i] = testAddresses[i];
        }
        
        // Simulate recycling activities
        for (uint256 i = 0; i < 50; i++) {
            address player = players[i % players.length];
            CannesGame.RecyclableType itemType = (i % 3 == 0) ? 
                CannesGame.RecyclableType.METAL : 
                CannesGame.RecyclableType.PLASTIC;
            
            // Use manual recording since we're seeding
            cannesGame.manualRecordDeposit(player, itemType);
        }
        
        console.log("Created 50 recycling activities for 15 players");
    }
    
    /**
     * @dev Seed NFC mappings
     */
    function seedNfcMappings() internal {
        console.log("Seeding NFC mappings...");
        
        string[] memory nfcIds = new string[](10);
        address[] memory wallets = new address[](10);
        
        // Create NFC ID mappings for first 10 test addresses
        for (uint256 i = 0; i < 10; i++) {
            nfcIds[i] = string(abi.encodePacked("NFC", vm.toString(i + 1)));
            wallets[i] = testAddresses[i];
        }
        
        // Batch map NFC IDs to wallets
        cannesGame.batchMapNfcToWallet(nfcIds, wallets);
        
        console.log("Mapped 10 NFC IDs to wallet addresses");
    }
    
    /**
     * @dev Helper function to display seeded data summary
     */
    function displaySummary() external view {
        console.log("\n--- Seeded Data Summary ---");
        
        // Guardian summary
        uint256 guardianCount = greenGuardians.getGuardianCount();
        uint256 totalDonated = greenGuardians.totalDonated();
        console.log("Guardians:", guardianCount);
        console.log("Total Donated:", totalDonated / 1e18, "ETH");
        
        // Game summary
        (
            uint256 totalPlayers,
            uint256 totalItems,
            uint256 totalMetal,
            uint256 totalPlastic,
            ,
            ,
        ) = cannesGame.getGameStats();
        
        console.log("Players:", totalPlayers);
        console.log("Total Items:", totalItems);
        console.log("Metal Items:", totalMetal);
        console.log("Plastic Items:", totalPlastic);
        console.log("---------------------------\n");
    }
}
