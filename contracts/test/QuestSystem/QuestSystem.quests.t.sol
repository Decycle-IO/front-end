// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";

/**
 * @title QuestSystemQuestsTest
 * @dev Tests for QuestSystem quests functionality
 */
contract QuestSystemQuestsTest is BaseTest {
    // Test constants
    uint256 constant QUEST_REQUIRED_AMOUNT = 100;
    uint256 constant QUEST_REWARD_AMOUNT = 1000 * 10**6; // 1,000 TRASH
    
    function setUp() public override {
        super.setUp();
        
        // Deploy full system
        deployFullSystem();
    }
    
    /**
     * @dev Test creating a quest
     */
    function testCreateQuest() public {
        // Create a quest
        vm.prank(owner);
        uint256 questId = questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest",
            "Test Description",
            QUEST_REQUIRED_AMOUNT,
            QUEST_REWARD_AMOUNT,
            false,
            ""
        );
        
        // Get the quest
        IQuestSystem.Quest memory quest = questSystem.getQuest(questId);
        
        // Check quest details
        assertEq(quest.name, "Test Quest");
        assertEq(quest.description, "Test Description");
        assertEq(quest.requiredAmount, QUEST_REQUIRED_AMOUNT);
        assertEq(quest.rewardAmount, QUEST_REWARD_AMOUNT);
        assertFalse(quest.nftReward);
        assertEq(quest.nftURI, "");
        assertTrue(quest.isActive);
    }
    
    /**
     * @dev Test creating a quest by non-owner
     */
    function testCreateQuestByNonOwner() public {
        // Try to create a quest as non-owner
        vm.prank(user1);
        vm.expectRevert();
        questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest",
            "Test Description",
            QUEST_REQUIRED_AMOUNT,
            QUEST_REWARD_AMOUNT,
            false,
            ""
        );
    }
    
    /**
     * @dev Test creating a quest of a specific type
     */
    function testCreateQuestOfType() public {
        // Create a quest of a specific type
        vm.prank(owner);
        uint256 questId = questSystem.createQuestOfType(
            IQuestSystem.QuestType.FIRST_RECYCLER,
            "First Recycler Quest",
            "Recycle your first item",
            1,
            QUEST_REWARD_AMOUNT,
            true,
            "ipfs://QmFirstRecycler"
        );
        
        // Get the quest
        IQuestSystem.Quest memory quest = questSystem.getQuest(questId);
        
        // Check quest details
        assertEq(quest.name, "First Recycler Quest");
        assertEq(quest.description, "Recycle your first item");
        assertEq(quest.requiredAmount, 1);
        assertEq(quest.rewardAmount, QUEST_REWARD_AMOUNT);
        assertTrue(quest.nftReward);
        assertEq(quest.nftURI, "ipfs://QmFirstRecycler");
        assertTrue(quest.isActive);
        
        // Check that the quest is in the correct type list
        uint256[] memory questIds = questSystem.getQuestsByType(IQuestSystem.QuestType.FIRST_RECYCLER);
        assertTrue(questIds.length > 0);
        bool found = false;
        for (uint256 i = 0; i < questIds.length; i++) {
            if (questIds[i] == questId) {
                found = true;
                break;
            }
        }
        assertTrue(found);
    }
    
    /**
     * @dev Test creating a quest of a specific type by non-owner
     */
    function testCreateQuestOfTypeByNonOwner() public {
        // Try to create a quest of a specific type as non-owner
        vm.prank(user1);
        vm.expectRevert();
        questSystem.createQuestOfType(
            IQuestSystem.QuestType.FIRST_RECYCLER,
            "First Recycler Quest",
            "Recycle your first item",
            1,
            QUEST_REWARD_AMOUNT,
            true,
            "ipfs://QmFirstRecycler"
        );
    }
    
    /**
     * @dev Test creating a custom quest
     */
    function testCreateCustomQuest() public {
        // Create a custom quest
        vm.prank(owner);
        uint256 questId = questSystem.createCustomQuest(
            "Custom Quest",
            "A custom quest",
            QUEST_REQUIRED_AMOUNT,
            QUEST_REWARD_AMOUNT,
            false,
            ""
        );
        
        // Get the quest
        IQuestSystem.Quest memory quest = questSystem.getQuest(questId);
        
        // Check quest details
        assertEq(quest.name, "Custom Quest");
        assertEq(quest.description, "A custom quest");
        assertEq(quest.requiredAmount, QUEST_REQUIRED_AMOUNT);
        assertEq(quest.rewardAmount, QUEST_REWARD_AMOUNT);
        assertFalse(quest.nftReward);
        assertEq(quest.nftURI, "");
        assertTrue(quest.isActive);
        
        // Check that the quest is in the custom type list
        uint256[] memory questIds = questSystem.getQuestsByType(IQuestSystem.QuestType.CUSTOM);
        assertTrue(questIds.length > 0);
        bool found = false;
        for (uint256 i = 0; i < questIds.length; i++) {
            if (questIds[i] == questId) {
                found = true;
                break;
            }
        }
        assertTrue(found);
    }
    
    /**
     * @dev Test creating a custom quest by non-owner
     */
    function testCreateCustomQuestByNonOwner() public {
        // Try to create a custom quest as non-owner
        vm.prank(user1);
        vm.expectRevert();
        questSystem.createCustomQuest(
            "Custom Quest",
            "A custom quest",
            QUEST_REQUIRED_AMOUNT,
            QUEST_REWARD_AMOUNT,
            false,
            ""
        );
    }
    
    /**
     * @dev Test updating a quest
     */
    function testUpdateQuest() public {
        // Create a quest
        vm.prank(owner);
        uint256 questId = questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest",
            "Test Description",
            QUEST_REQUIRED_AMOUNT,
            QUEST_REWARD_AMOUNT,
            false,
            ""
        );
        
        // Update the quest
        vm.prank(owner);
        questSystem.updateQuest(
            questId,
            IQuestSystem.QuestType.CUSTOM,
            "Updated Quest",
            "Updated Description",
            QUEST_REQUIRED_AMOUNT * 2,
            QUEST_REWARD_AMOUNT * 2,
            true,
            "ipfs://QmUpdated"
        );
        
        // Get the updated quest
        IQuestSystem.Quest memory quest = questSystem.getQuest(questId);
        
        // Check updated quest details
        assertEq(quest.name, "Updated Quest");
        assertEq(quest.description, "Updated Description");
        assertEq(quest.requiredAmount, QUEST_REQUIRED_AMOUNT * 2);
        assertEq(quest.rewardAmount, QUEST_REWARD_AMOUNT * 2);
        assertTrue(quest.nftReward);
        assertEq(quest.nftURI, "ipfs://QmUpdated");
        assertTrue(quest.isActive);
    }
    
    /**
     * @dev Test updating a quest by non-owner
     */
    function testUpdateQuestByNonOwner() public {
        // Create a quest
        vm.prank(owner);
        uint256 questId = questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest",
            "Test Description",
            QUEST_REQUIRED_AMOUNT,
            QUEST_REWARD_AMOUNT,
            false,
            ""
        );
        
        // Try to update the quest as non-owner
        vm.prank(user1);
        vm.expectRevert();
        questSystem.updateQuest(
            questId,
            IQuestSystem.QuestType.CUSTOM,
            "Updated Quest",
            "Updated Description",
            QUEST_REQUIRED_AMOUNT * 2,
            QUEST_REWARD_AMOUNT * 2,
            true,
            "ipfs://QmUpdated"
        );
    }
    
    /**
     * @dev Test updating a non-existent quest
     */
    function testUpdateNonExistentQuest() public {
        // Try to update a non-existent quest
        vm.prank(owner);
        vm.expectRevert();
        questSystem.updateQuest(
            999,
            IQuestSystem.QuestType.CUSTOM,
            "Updated Quest",
            "Updated Description",
            QUEST_REQUIRED_AMOUNT * 2,
            QUEST_REWARD_AMOUNT * 2,
            true,
            "ipfs://QmUpdated"
        );
    }
    
    /**
     * @dev Test getting a quest
     */
    function testGetQuest() public {
        // Create a quest
        vm.prank(owner);
        uint256 questId = questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest",
            "Test Description",
            QUEST_REQUIRED_AMOUNT,
            QUEST_REWARD_AMOUNT,
            false,
            ""
        );
        
        // Get the quest
        IQuestSystem.Quest memory quest = questSystem.getQuest(questId);
        
        // Check quest details
        assertEq(quest.name, "Test Quest");
        assertEq(quest.description, "Test Description");
        assertEq(quest.requiredAmount, QUEST_REQUIRED_AMOUNT);
        assertEq(quest.rewardAmount, QUEST_REWARD_AMOUNT);
        assertFalse(quest.nftReward);
        assertEq(quest.nftURI, "");
        assertTrue(quest.isActive);
    }
    
    /**
     * @dev Test getting a non-existent quest
     */
    function testGetNonExistentQuest() public {
        // Try to get a non-existent quest
        vm.expectRevert();
        questSystem.getQuest(999);
    }
    
    /**
     * @dev Test getting quests by type
     */
    function testGetQuestsByType() public {
        // Create quests of different types
        vm.startPrank(owner);
        uint256 questId1 = questSystem.createQuestOfType(
            IQuestSystem.QuestType.FIRST_RECYCLER,
            "First Recycler Quest",
            "Recycle your first item",
            1,
            QUEST_REWARD_AMOUNT,
            true,
            "ipfs://QmFirstRecycler"
        );
        
        uint256 questId2 = questSystem.createQuestOfType(
            IQuestSystem.QuestType.WEEKLY_WARRIOR,
            "Weekly Warrior Quest",
            "Recycle 10 items in a week",
            10,
            QUEST_REWARD_AMOUNT * 2,
            true,
            "ipfs://QmWeeklyWarrior"
        );
        vm.stopPrank();
        
        // Get quests by type
        uint256[] memory firstRecyclerQuests = questSystem.getQuestsByType(IQuestSystem.QuestType.FIRST_RECYCLER);
        uint256[] memory weeklyWarriorQuests = questSystem.getQuestsByType(IQuestSystem.QuestType.WEEKLY_WARRIOR);
        
        // Check that the quests are in the correct type lists
        assertTrue(firstRecyclerQuests.length > 0);
        assertTrue(weeklyWarriorQuests.length > 0);
        
        bool foundFirstRecycler = false;
        for (uint256 i = 0; i < firstRecyclerQuests.length; i++) {
            if (firstRecyclerQuests[i] == questId1) {
                foundFirstRecycler = true;
                break;
            }
        }
        assertTrue(foundFirstRecycler);
        
        bool foundWeeklyWarrior = false;
        for (uint256 i = 0; i < weeklyWarriorQuests.length; i++) {
            if (weeklyWarriorQuests[i] == questId2) {
                foundWeeklyWarrior = true;
                break;
            }
        }
        assertTrue(foundWeeklyWarrior);
    }
    
    /**
     * @dev Test getting quests by type when no quests exist
     */
    function testGetQuestsByTypeWhenNoQuestsExist() public {
        // Get quests by type when no quests exist
        uint256[] memory quests = questSystem.getQuestsByType(IQuestSystem.QuestType.MATERIAL_MASTER);
        
        // Check that the list is empty
        assertEq(quests.length, 0);
    }
    
    /**
     * @dev Test getting active quests
     */
    function testGetActiveQuests() public {
        // Create quests
        vm.startPrank(owner);
        uint256 questId1 = questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest 1",
            "Test Description 1",
            QUEST_REQUIRED_AMOUNT,
            QUEST_REWARD_AMOUNT,
            false,
            ""
        );
        
        uint256 questId2 = questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest 2",
            "Test Description 2",
            QUEST_REQUIRED_AMOUNT * 2,
            QUEST_REWARD_AMOUNT * 2,
            true,
            "ipfs://QmTest2"
        );
        vm.stopPrank();
        
        // Get active quests
        uint256[] memory activeQuests = questSystem.getActiveQuests(0, 10);
        
        // Check that both quests are active
        assertEq(activeQuests.length, 2);
        
        // Check that the quests are in the active list
        bool found1 = false;
        bool found2 = false;
        for (uint256 i = 0; i < activeQuests.length; i++) {
            if (activeQuests[i] == questId1) {
                found1 = true;
            }
            if (activeQuests[i] == questId2) {
                found2 = true;
            }
        }
        assertTrue(found1);
        assertTrue(found2);
    }
    
    /**
     * @dev Test getting all active quests
     */
    function testGetAllActiveQuests() public {
        // Create quests
        vm.startPrank(owner);
        uint256 questId1 = questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest 1",
            "Test Description 1",
            QUEST_REQUIRED_AMOUNT,
            QUEST_REWARD_AMOUNT,
            false,
            ""
        );
        
        uint256 questId2 = questSystem.createQuest(
            IQuestSystem.QuestType.CUSTOM,
            "Test Quest 2",
            "Test Description 2",
            QUEST_REQUIRED_AMOUNT * 2,
            QUEST_REWARD_AMOUNT * 2,
            true,
            "ipfs://QmTest2"
        );
        vm.stopPrank();
        
        // Get all active quests
        uint256[] memory allActiveQuests = questSystem.getAllActiveQuests();
        
        // Check that both quests are active
        assertEq(allActiveQuests.length, 2);
        
        // Check that the quests are in the active list
        bool found1 = false;
        bool found2 = false;
        for (uint256 i = 0; i < allActiveQuests.length; i++) {
            if (allActiveQuests[i] == questId1) {
                found1 = true;
            }
            if (allActiveQuests[i] == questId2) {
                found2 = true;
            }
        }
        assertTrue(found1);
        assertTrue(found2);
    }
}
