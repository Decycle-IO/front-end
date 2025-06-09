// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/TrashToken.sol";
import "../src/core/StakeNFT.sol";
import "../src/core/AchievementNFT.sol";
import "../src/core/EmailVerifier.sol";
import "../src/core/RecyclingSystem.sol";
import "../src/core/QuestSystem.sol";
import "../src/core/TrashGenesis.sol";
import "../src/interfaces/ITrashGenesis.sol";
import "../src/mocks/TestUSDC.sol";

/**
 * @title Deploy
 * @dev Script for deploying the entire contract system to Avalanche testnet
 */
contract Deploy is Script {
    // Contract instances
    TrashToken public trashToken;
    TestUSDC public testUSDC;
    StakeNFT public stakeNFT;
    AchievementNFT public achievementNFT;
    EmailVerifier public emailVerifier;
    RecyclingSystem public recyclingSystem;
    QuestSystem public questSystem;
    TrashGenesis public trashGenesis;

    // Deployment addresses
    address public deployerAddress;
    address public trashTokenAddress;
    address public testUSDCAddress;
    address public stakeNFTAddress;
    address public achievementNFTAddress;
    address public emailVerifierAddress;
    address public recyclingSystemAddress;
    address public questSystemAddress;
    address public trashGenesisAddress;

    // Deployment flags
    bool public skipTrashToken = false;
    bool public skipTestUSDC = false;
    bool public skipStakeNFT = false;
    bool public skipAchievementNFT = false;
    bool public skipEmailVerifier = false;
    bool public skipRecyclingSystem = false;
    bool public skipQuestSystem = false;
    bool public skipTrashGenesis = false;

    /**
     * @dev Main deployment function
     */
    function run() public {
        // Get the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployerAddress = vm.addr(deployerPrivateKey);
        
        console.log("Deployer address:", deployerAddress);
        
        // Check for existing contract addresses from environment variables
        checkExistingDeployments();
        
        // Start the deployment
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy contracts in order of dependencies
        deployTrashToken();
        deployTestUSDC();
        deployStakeNFT();
        deployAchievementNFT();
        deployEmailVerifier();
        deployRecyclingSystem();
        deployQuestSystem();
        deployTrashGenesis();
        
        // Setup contract permissions and relationships
        setupContractPermissions();
        
        vm.stopBroadcast();
        
        // Log all deployed contract addresses
        logDeployedAddresses();
    }
    
    /**
     * @dev Check for existing contract addresses from environment variables
     */
    function checkExistingDeployments() internal {
        // Check if contracts are already deployed
        try vm.envAddress("TRASH_TOKEN_ADDRESS") returns (address addr) {
            trashTokenAddress = addr;
            skipTrashToken = true;
            console.log("Using existing TrashToken at:", trashTokenAddress);
        } catch {}
        
        try vm.envAddress("TEST_USDC_ADDRESS") returns (address addr) {
            testUSDCAddress = addr;
            skipTestUSDC = true;
            console.log("Using existing TestUSDC at:", testUSDCAddress);
        } catch {}
        
        try vm.envAddress("STAKE_NFT_ADDRESS") returns (address addr) {
            stakeNFTAddress = addr;
            skipStakeNFT = true;
            console.log("Using existing StakeNFT at:", stakeNFTAddress);
        } catch {}
        
        try vm.envAddress("ACHIEVEMENT_NFT_ADDRESS") returns (address addr) {
            achievementNFTAddress = addr;
            skipAchievementNFT = true;
            console.log("Using existing AchievementNFT at:", achievementNFTAddress);
        } catch {}
        
        try vm.envAddress("EMAIL_VERIFIER_ADDRESS") returns (address addr) {
            emailVerifierAddress = addr;
            skipEmailVerifier = true;
            console.log("Using existing EmailVerifier at:", emailVerifierAddress);
        } catch {}
        
        try vm.envAddress("RECYCLING_SYSTEM_ADDRESS") returns (address addr) {
            recyclingSystemAddress = addr;
            skipRecyclingSystem = true;
            console.log("Using existing RecyclingSystem at:", recyclingSystemAddress);
        } catch {}
        
        try vm.envAddress("QUEST_SYSTEM_ADDRESS") returns (address addr) {
            questSystemAddress = addr;
            skipQuestSystem = true;
            console.log("Using existing QuestSystem at:", questSystemAddress);
        } catch {}
        
        try vm.envAddress("TRASH_GENESIS_ADDRESS") returns (address addr) {
            trashGenesisAddress = addr;
            skipTrashGenesis = true;
            console.log("Using existing TrashGenesis at:", trashGenesisAddress);
        } catch {}
    }
    
    /**
     * @dev Deploy TrashToken contract
     */
    function deployTrashToken() internal {
        if (skipTrashToken) {
            trashToken = TrashToken(trashTokenAddress);
            return;
        }
        
        console.log("Deploying TrashToken...");
        trashToken = new TrashToken(deployerAddress);
        trashTokenAddress = address(trashToken);
        console.log("TrashToken deployed at:", trashTokenAddress);
    }
    
    /**
     * @dev Deploy TestUSDC contract
     */
    function deployTestUSDC() internal {
        if (skipTestUSDC) {
            testUSDC = TestUSDC(testUSDCAddress);
            return;
        }
        
        console.log("Deploying TestUSDC...");
        testUSDC = new TestUSDC(deployerAddress);
        testUSDCAddress = address(testUSDC);
        console.log("TestUSDC deployed at:", testUSDCAddress);
    }
    
    /**
     * @dev Deploy StakeNFT contract
     */
    function deployStakeNFT() internal {
        if (skipStakeNFT) {
            stakeNFT = StakeNFT(stakeNFTAddress);
            return;
        }
        
        console.log("Deploying StakeNFT...");
        stakeNFT = new StakeNFT(deployerAddress, trashTokenAddress);
        stakeNFTAddress = address(stakeNFT);
        console.log("StakeNFT deployed at:", stakeNFTAddress);
    }
    
    /**
     * @dev Deploy AchievementNFT contract
     */
    function deployAchievementNFT() internal {
        if (skipAchievementNFT) {
            achievementNFT = AchievementNFT(achievementNFTAddress);
            return;
        }
        
        console.log("Deploying AchievementNFT...");
        achievementNFT = new AchievementNFT(deployerAddress);
        achievementNFTAddress = address(achievementNFT);
        console.log("AchievementNFT deployed at:", achievementNFTAddress);
    }
    
    /**
     * @dev Deploy EmailVerifier contract
     */
    function deployEmailVerifier() internal {
        if (skipEmailVerifier) {
            emailVerifier = EmailVerifier(emailVerifierAddress);
            return;
        }
        
        console.log("Deploying EmailVerifier...");
        emailVerifier = new EmailVerifier(deployerAddress);
        emailVerifierAddress = address(emailVerifier);
        console.log("EmailVerifier deployed at:", emailVerifierAddress);
    }
    
    /**
     * @dev Deploy RecyclingSystem contract
     */
    function deployRecyclingSystem() internal {
        if (skipRecyclingSystem) {
            recyclingSystem = RecyclingSystem(recyclingSystemAddress);
            return;
        }
        
        console.log("Deploying RecyclingSystem...");
        recyclingSystem = new RecyclingSystem(
            deployerAddress,
            testUSDCAddress,
            stakeNFTAddress,
            trashTokenAddress
        );
        recyclingSystemAddress = address(recyclingSystem);
        console.log("RecyclingSystem deployed at:", recyclingSystemAddress);
    }
    
    /**
     * @dev Deploy QuestSystem contract
     */
    function deployQuestSystem() internal {
        if (skipQuestSystem) {
            questSystem = QuestSystem(questSystemAddress);
            return;
        }
        
        console.log("Deploying QuestSystem...");
        questSystem = new QuestSystem(
            deployerAddress,
            trashTokenAddress,
            achievementNFTAddress,
            emailVerifierAddress,
            recyclingSystemAddress
        );
        questSystemAddress = address(questSystem);
        console.log("QuestSystem deployed at:", questSystemAddress);
    }
    
    /**
     * @dev Setup contract permissions and relationships
     */
    function setupContractPermissions() internal {
        console.log("Setting up contract permissions...");
        
        // Authorize StakeNFT as a minter for TrashToken
        if (!trashToken.isAuthorizedMinter(stakeNFTAddress)) {
            trashToken.authorizeMinter(stakeNFTAddress);
            console.log("Authorized StakeNFT as TrashToken minter");
        }
        
        // Authorize RecyclingSystem as a minter for StakeNFT
        if (!stakeNFT.isAuthorizedMinter(recyclingSystemAddress)) {
            stakeNFT.authorizeMinter(recyclingSystemAddress);
            console.log("Authorized RecyclingSystem as StakeNFT minter");
        }
        
        // Authorize QuestSystem as a minter for TrashToken
        if (!trashToken.isAuthorizedMinter(questSystemAddress)) {
            trashToken.authorizeMinter(questSystemAddress);
            console.log("Authorized QuestSystem as TrashToken minter");
        }
        
        // Authorize QuestSystem as a minter for AchievementNFT
        if (!achievementNFT.isAuthorizedMinter(questSystemAddress)) {
            achievementNFT.authorizeMinter(questSystemAddress);
            console.log("Authorized QuestSystem as AchievementNFT minter");
        }
        
        // Authorize RecyclingSystem as a recorder for QuestSystem
        if (!questSystem.isAuthorizedRecorder(recyclingSystemAddress)) {
            questSystem.authorizeRecorder(recyclingSystemAddress);
            console.log("Authorized RecyclingSystem as QuestSystem recorder");
        }
        
        console.log("Contract permissions setup complete");
    }
    
    /**
     * @dev Log all deployed contract addresses
     */
    /**
     * @dev Deploy TrashGenesis contract
     */
    function deployTrashGenesis() internal {
        if (skipTrashGenesis) {
            trashGenesis = TrashGenesis(trashGenesisAddress);
            return;
        }
        
        console.log("Deploying TrashGenesis...");
        // ETH price in USD (scaled by 1e8) - $2500 per ETH
        uint256 initialEthPrice = 250_000_000_000;
        trashGenesis = new TrashGenesis(
            trashTokenAddress,
            deployerAddress, // Treasury address (initially set to deployer)
            initialEthPrice
        );
        trashGenesisAddress = address(trashGenesis);
        console.log("TrashGenesis deployed at:", trashGenesisAddress);
        
        // Setup initial phase configurations
        // Private phase: $0.001 per token, 50 ETH hard cap, 0.1 ETH min, 5 ETH max
        trashGenesis.updatePhaseConfig(
            ITrashGenesis.SalePhase.Private,
            1000, // $0.001 per token (scaled by 1e6)
            50 ether,
            0.1 ether,
            5 ether
        );
        
        // Whitelist phase: $0.0015 per token, 75 ETH hard cap, 0.1 ETH min, 3 ETH max
        trashGenesis.updatePhaseConfig(
            ITrashGenesis.SalePhase.Whitelist,
            1500, // $0.0015 per token (scaled by 1e6)
            75 ether,
            0.1 ether,
            3 ether
        );
        
        // Public phase: $0.002 per token, 75 ETH hard cap, 0.05 ETH min, 2 ETH max
        trashGenesis.updatePhaseConfig(
            ITrashGenesis.SalePhase.Public,
            2000, // $0.002 per token (scaled by 1e6)
            75 ether,
            0.05 ether,
            2 ether
        );
        
        // Authorize TrashGenesis as a minter for TrashToken
        if (!trashToken.isAuthorizedMinter(trashGenesisAddress)) {
            trashToken.authorizeMinter(trashGenesisAddress);
            console.log("Authorized TrashGenesis as TrashToken minter");
        }
    }
    
    /**
     * @dev Log all deployed contract addresses
     */
    function logDeployedAddresses() internal view {
        console.log("\n--- Deployed Contract Addresses ---");
        console.log("TrashToken:", trashTokenAddress);
        console.log("TestUSDC:", testUSDCAddress);
        console.log("StakeNFT:", stakeNFTAddress);
        console.log("AchievementNFT:", achievementNFTAddress);
        console.log("EmailVerifier:", emailVerifierAddress);
        console.log("RecyclingSystem:", recyclingSystemAddress);
        console.log("QuestSystem:", questSystemAddress);
        console.log("TrashGenesis:", trashGenesisAddress);
        console.log("----------------------------------\n");
    }
}
