// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../../lib/openzeppelin-contracts/lib/forge-std/src/Test.sol";
import "../../lib/openzeppelin-contracts/lib/forge-std/src/console.sol";
import "../../src/core/RecyclingSystem.sol";
import "../../src/mocks/MockRecyclingSystem.sol";
import "../../src/core/StakeNFT.sol";
import "../../src/core/TrashToken.sol";
import "../../src/core/QuestSystem.sol";
import "../../src/core/AchievementNFT.sol";
import "../../src/core/EmailVerifier.sol";
import "../../src/mocks/TestUSDC.sol";

/**
 * @title BaseTest
 * @dev Base contract for all test contracts
 */
contract BaseTest is Test {
    // Common addresses
    address internal owner;
    address internal user1;
    address internal user2;
    address internal user3;
    address internal user4;
    address internal updater;
    address internal deployer;
    address internal collector;

    // Common contracts
    TestUSDC internal usdcToken;
    TrashToken internal trashToken;
    StakeNFT internal stakeNFT;
    AchievementNFT internal achievementNFT;
    EmailVerifier internal emailVerifier;
    RecyclingSystem internal recyclingSystem;
    MockRecyclingSystem internal mockRecyclingSystem;
    QuestSystem internal questSystem;

    // Common constants
    uint256 internal constant INITIAL_BALANCE = 1000000 * 10**6; // 1,000,000 USDC
    bytes32 internal constant EMAIL_HASH = keccak256(abi.encodePacked("user@example.com"));
    
    /**
     * @dev Sets up the test environment
     */
    function setUp() public virtual {
        // Set up addresses
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        user4 = makeAddr("user4");
        updater = makeAddr("updater");
        deployer = makeAddr("deployer");
        collector = makeAddr("collector");

        // Deploy mock USDC
        usdcToken = new TestUSDC(owner);
        
        // Fund accounts
        usdcToken.mint(owner, INITIAL_BALANCE);
        usdcToken.mint(user1, INITIAL_BALANCE);
        usdcToken.mint(user2, INITIAL_BALANCE);
        usdcToken.mint(user3, INITIAL_BALANCE);
        usdcToken.mint(user4, INITIAL_BALANCE);
        usdcToken.mint(collector, INITIAL_BALANCE);
        
        vm.label(owner, "Owner");
        vm.label(user1, "User1");
        vm.label(user2, "User2");
        vm.label(user3, "User3");
        vm.label(user4, "User4");
        vm.label(updater, "Updater");
        vm.label(deployer, "Deployer");
        vm.label(collector, "Collector");
        vm.label(address(usdcToken), "USDC");
        
        // Deploy the full system by default for most tests
        // Individual test contracts can override this if needed
        deployFullSystem();
    }
    
    /**
     * @dev Helper to deploy the full system
     */
    function deployFullSystem() internal {
        // Deploy core contracts
        trashToken = new TrashToken(owner);
        vm.label(address(trashToken), "TrashToken");
        
        stakeNFT = new StakeNFT(owner, address(trashToken));
        vm.label(address(stakeNFT), "StakeNFT");
        
        achievementNFT = new AchievementNFT(owner);
        vm.label(address(achievementNFT), "AchievementNFT");
        
        emailVerifier = new EmailVerifier(owner);
        vm.label(address(emailVerifier), "EmailVerifier");
        
        recyclingSystem = new RecyclingSystem(
            owner,
            address(usdcToken),
            address(stakeNFT),
            address(trashToken)
        );
        vm.label(address(recyclingSystem), "RecyclingSystem");
        
        mockRecyclingSystem = new MockRecyclingSystem();
        vm.label(address(mockRecyclingSystem), "MockRecyclingSystem");
        
        questSystem = new QuestSystem(
            owner,
            address(trashToken),
            address(achievementNFT),
            address(emailVerifier),
            address(mockRecyclingSystem)
        );
        vm.label(address(questSystem), "QuestSystem");
        
        // Set up authorizations
        vm.startPrank(owner);
        trashToken.authorizeMinter(address(recyclingSystem));
        trashToken.authorizeMinter(address(questSystem));
        
        stakeNFT.authorizeMinter(address(recyclingSystem));
        
        achievementNFT.authorizeMinter(address(questSystem));
        
        recyclingSystem.authorizeUpdater(updater);
        recyclingSystem.authorizeDeployer(deployer);
        
        questSystem.authorizeRecorder(address(recyclingSystem));
        questSystem.authorizeCreator(owner);
        vm.stopPrank();
        
    }
    
    /**
     * @dev Helper to create a mock email verification proof
     */
    function createMockEmailProof() internal pure returns (bytes memory) {
        // This is a placeholder for a real proof
        // In a real test, we would need to generate a valid proof
        return abi.encodePacked("mock_proof");
    }
}
