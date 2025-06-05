// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";
import "../../src/mocks/MockEmailVerifier.sol";

/**
 * @title QuestSystemDeploymentTest
 * @dev Tests for QuestSystem deployment functionality
 */
contract QuestSystemDeploymentTest is BaseTest {
    function setUp() public override {
        super.setUp();
        
        // Deploy dependencies
        trashToken = new TrashToken(owner);
        achievementNFT = new AchievementNFT(owner);
        emailVerifier = EmailVerifier(address(new MockEmailVerifier(owner)));
        recyclingSystem = new RecyclingSystem(owner, address(usdcToken), address(stakeNFT), address(trashToken));
    }
    
    /**
     * @dev Test constructor
     */
    function testConstructor() public {
        // Deploy QuestSystem
        questSystem = new QuestSystem(
            owner,
            address(trashToken),
            address(achievementNFT),
            address(emailVerifier),
            address(recyclingSystem)
        );
        
        // Check owner
        assertEq(questSystem.owner(), owner);
    }
    
    /**
     * @dev Test authorizing a recorder
     */
    function testAuthorizeRecorder() public {
        // Deploy QuestSystem
        questSystem = new QuestSystem(
            owner,
            address(trashToken),
            address(achievementNFT),
            address(emailVerifier),
            address(recyclingSystem)
        );
        
        // Check initial state
        assertFalse(questSystem.isAuthorizedRecorder(user1));
        
        // Authorize recorder
        vm.prank(owner);
        questSystem.authorizeRecorder(user1);
        
        // Check state after authorization
        assertTrue(questSystem.isAuthorizedRecorder(user1));
    }
    
    /**
     * @dev Test authorizing a recorder by non-owner
     */
    function testAuthorizeRecorderByNonOwner() public {
        // Deploy QuestSystem
        questSystem = new QuestSystem(
            owner,
            address(trashToken),
            address(achievementNFT),
            address(emailVerifier),
            address(recyclingSystem)
        );
        
        // Try to authorize recorder as non-owner
        vm.prank(user1);
        vm.expectRevert();
        questSystem.authorizeRecorder(user2);
    }
    
    /**
     * @dev Test unauthorizing a recorder
     */
    function testUnauthorizeRecorder() public {
        // Deploy QuestSystem
        questSystem = new QuestSystem(
            owner,
            address(trashToken),
            address(achievementNFT),
            address(emailVerifier),
            address(recyclingSystem)
        );
        
        // Authorize recorder
        vm.prank(owner);
        questSystem.authorizeRecorder(user1);
        assertTrue(questSystem.isAuthorizedRecorder(user1));
        
        // Unauthorize recorder
        vm.prank(owner);
        questSystem.unauthorizeRecorder(user1);
        
        // Check state after revocation
        assertFalse(questSystem.isAuthorizedRecorder(user1));
    }
    
    /**
     * @dev Test unauthorizing a recorder by non-owner
     */
    function testUnauthorizeRecorderByNonOwner() public {
        // Deploy QuestSystem
        questSystem = new QuestSystem(
            owner,
            address(trashToken),
            address(achievementNFT),
            address(emailVerifier),
            address(recyclingSystem)
        );
        
        // Authorize recorder
        vm.prank(owner);
        questSystem.authorizeRecorder(user1);
        
        // Try to unauthorize as non-owner
        vm.prank(user1);
        vm.expectRevert();
        questSystem.unauthorizeRecorder(user1);
    }
    
    /**
     * @dev Test pausing the contract
     */
    function testPause() public {
        // Deploy QuestSystem
        questSystem = new QuestSystem(
            owner,
            address(trashToken),
            address(achievementNFT),
            address(emailVerifier),
            address(recyclingSystem)
        );
        
        // Pause the contract
        vm.prank(owner);
        questSystem.pause();
        
        // Try to create a quest when paused
        vm.prank(owner);
        vm.expectRevert();
        questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest",
            "Test Description",
            100,
            1000 * 10**6,
            false,
            ""
        );
    }
    
    /**
     * @dev Test pausing the contract by non-owner
     */
    function testPauseByNonOwner() public {
        // Deploy QuestSystem
        questSystem = new QuestSystem(
            owner,
            address(trashToken),
            address(achievementNFT),
            address(emailVerifier),
            address(recyclingSystem)
        );
        
        // Try to pause as non-owner
        vm.prank(user1);
        vm.expectRevert();
        questSystem.pause();
    }
    
    /**
     * @dev Test unpausing the contract
     */
    function testUnpause() public {
        // Deploy QuestSystem
        questSystem = new QuestSystem(
            owner,
            address(trashToken),
            address(achievementNFT),
            address(emailVerifier),
            address(recyclingSystem)
        );
        
        // Pause the contract
        vm.prank(owner);
        questSystem.pause();
        
        // Unpause the contract
        vm.prank(owner);
        questSystem.unpause();
        
        // Should be able to create a quest now
        vm.prank(owner);
        questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest",
            "Test Description",
            100,
            1000 * 10**6,
            false,
            ""
        );
    }
    
    /**
     * @dev Test unpausing the contract by non-owner
     */
    function testUnpauseByNonOwner() public {
        // Deploy QuestSystem
        questSystem = new QuestSystem(
            owner,
            address(trashToken),
            address(achievementNFT),
            address(emailVerifier),
            address(recyclingSystem)
        );
        
        // Pause the contract
        vm.prank(owner);
        questSystem.pause();
        
        // Try to unpause as non-owner
        vm.prank(user1);
        vm.expectRevert();
        questSystem.unpause();
    }
}
