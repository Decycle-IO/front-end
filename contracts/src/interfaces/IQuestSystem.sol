// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./IRecyclingSystem.sol";

/**
 * @title IQuestSystem
 * @dev Interface for the QuestSystem contract
 */
interface IQuestSystem {
    /**
     * @dev Enum representing different quest types
     */
    enum QuestType {
        FIRST_RECYCLER,    // Recycle anything once
        WEEKLY_WARRIOR,    // Recycle 5 items in a week
        EARTH_CHAMPION,    // Recycle 20 items total
        MATERIAL_MASTER,   // Recycle all material types
        CUSTOM             // Custom quest type (for dynamic quests)
    }

    /**
     * @dev Struct containing information about a quest
     */
    struct Quest {
        string name;
        string description;
        uint256 requiredAmount;
        uint256 rewardAmount;  // TRASH tokens
        bool nftReward;        // if true, also mints NFT
        string nftURI;         // metadata URI for the NFT
        bool isActive;         // whether the quest is active
    }

    /**
     * @dev Struct containing information about a quest template
     */
    struct QuestTemplate {
        string name;
        string description;
        uint256 requiredAmount;
        uint256 rewardAmount;
        bool nftReward;
        string nftURI;
        bool isActive;
    }
    
    /**
     * @dev Struct containing user statistics for quest completion
     */
    struct UserStats {
        uint256 totalRecycledWeight;
        uint256 recyclingCount;
        uint256 stakedAmount;
        uint256 stakeDuration;
    }

    /**
     * @dev Emitted when a quest is completed
     */
    event QuestCompleted(bytes32 indexed emailHash, QuestType questType, uint256 questId);
    
    /**
     * @dev Emitted when a reward is claimed
     */
    event RewardClaimed(address indexed wallet, QuestType questType, uint256 questId, uint256 tokenAmount, uint256 nftId);
    
    /**
     * @dev Emitted when an email is verified
     */
    event EmailVerified(bytes32 indexed emailHash, address indexed wallet);
    
    /**
     * @dev Emitted when recycling is recorded
     */
    event RecyclingRecorded(bytes32 indexed emailHash, IRecyclingSystem.RecyclableType materialType, uint256 amount);
    
    /**
     * @dev Emitted when a new quest is created
     */
    event QuestCreated(uint256 indexed questId, QuestType questType, string name, uint256 requiredAmount);
    
    /**
     * @dev Emitted when a quest is updated
     */
    event QuestUpdated(uint256 indexed questId, QuestType questType, string name, uint256 requiredAmount);

    /**
     * @dev Emitted when a creator is authorized
     */
    event CreatorAuthorized(address indexed creator);

    /**
     * @dev Emitted when a creator is unauthorized
     */
    event CreatorUnauthorized(address indexed creator);

    /**
     * @dev Emitted when a quest template is created
     */
    event QuestTemplateCreated(uint256 indexed templateId, string name, uint256 requiredAmount);

    /**
     * @dev Emitted when a quest template is updated
     */
    event QuestTemplateUpdated(uint256 indexed templateId, string name, uint256 requiredAmount);

    /**
     * @dev Emitted when a quest is created from a template
     */
    event QuestCreatedFromTemplate(uint256 indexed templateId, uint256 indexed questId, QuestType questType);

    /**
     * @dev Emitted when a recorder is authorized
     */
    event RecorderAuthorized(address indexed recorder);

    /**
     * @dev Emitted when a recorder is unauthorized
     */
    event RecorderUnauthorized(address indexed recorder);

    /**
     * @dev Records recycling activity for a user
     * @param emailHash The hash of the user's email
     * @param materialType The type of material recycled
     * @param amount The amount recycled
     */
    function recordRecycling(
        bytes32 emailHash,
        IRecyclingSystem.RecyclableType materialType,
        uint256 amount
    ) external;

    /**
     * @dev Verifies a user's email and links it to their wallet address
     * @param emailHash The hash of the user's email
     * @param proof The zkemail proof
     */
    function verifyEmail(bytes32 emailHash, bytes memory proof) external;

    /**
     * @dev Claims rewards for completed quests
     * @param questType The type of quest to claim rewards for
     * @param questId The ID of the quest to claim rewards for
     */
    function claimRewards(QuestType questType, uint256 questId) external;

    /**
     * @dev Creates a new quest
     * @param questType The type of quest
     * @param name The name of the quest
     * @param description The description of the quest
     * @param requiredAmount The required amount to complete the quest
     * @param rewardAmount The reward amount for completing the quest
     * @param nftReward Whether to reward an NFT
     * @param nftURI The URI for the NFT
     * @return The ID of the newly created quest
     */
    function createQuest(
        QuestType questType,
        string memory name,
        string memory description,
        uint256 requiredAmount,
        uint256 rewardAmount,
        bool nftReward,
        string memory nftURI
    ) external returns (uint256);

    /**
     * @dev Updates an existing quest
     * @param questId The ID of the quest to update
     * @param questType The type of quest
     * @param name The name of the quest
     * @param description The description of the quest
     * @param requiredAmount The required amount to complete the quest
     * @param rewardAmount The reward amount for completing the quest
     * @param nftReward Whether to reward an NFT
     * @param nftURI The URI for the NFT
     */
    function updateQuest(
        uint256 questId,
        QuestType questType,
        string memory name,
        string memory description,
        uint256 requiredAmount,
        uint256 rewardAmount,
        bool nftReward,
        string memory nftURI
    ) external;

    /**
     * @dev Gets the progress of a quest for a user
     * @param emailHash The hash of the user's email
     * @param questType The type of quest
     * @param questId The ID of the quest
     * @return progress The progress of the quest
     * @return required The required amount to complete the quest
     * @return completed Whether the quest is completed
     * @return claimed Whether the quest rewards have been claimed
     */
    function getQuestStatus(bytes32 emailHash, QuestType questType, uint256 questId) external view returns (
        uint256 progress,
        uint256 required,
        bool completed,
        bool claimed
    );

    /**
     * @dev Gets information about a quest
     * @param questId The ID of the quest
     * @return The quest information
     */
    function getQuest(uint256 questId) external view returns (Quest memory);

    /**
     * @dev Gets all quests of a specific type
     * @param questType The type of quest
     * @return Array of quest IDs
     */
    function getQuestsByType(QuestType questType) external view returns (uint256[] memory);

    /**
     * @dev Gets all active quests with pagination
     * @param offset The offset to start from
     * @param limit The maximum number of quests to return
     * @return Array of quest IDs
     */
    function getActiveQuests(uint256 offset, uint256 limit) external view returns (uint256[] memory);
    
    /**
     * @dev Gets all active quests (legacy method, may hit gas limits with many quests)
     * @return Array of quest IDs
     */
    function getAllActiveQuests() external view returns (uint256[] memory);
    
    /**
     * @dev Gets the verified email hash for the caller's wallet address
     * @return The email hash associated with the wallet, or bytes32(0) if not verified
     */
    function getVerifiedEmail() external view returns (bytes32);

    /**
     * @dev Checks if an address is authorized to record recycling
     * @param recorder The address to check
     * @return Whether the address is authorized to record recycling
     */
    function isAuthorizedRecorder(address recorder) external view returns (bool);

    /**
     * @dev Authorizes an address to record recycling
     * @param recorder The address to authorize
     */
    function authorizeRecorder(address recorder) external;

    /**
     * @dev Unauthorizes an address to record recycling
     * @param recorder The address to unauthorize
     */
    function unauthorizeRecorder(address recorder) external;

    /**
     * @dev Checks if an address is authorized to create quests
     * @param creator The address to check
     * @return Whether the address is authorized to create quests
     */
    function isAuthorizedCreator(address creator) external view returns (bool);

    /**
     * @dev Authorizes an address to create quests
     * @param creator The address to authorize
     */
    function authorizeCreator(address creator) external;

    /**
     * @dev Unauthorizes an address to create quests
     * @param creator The address to unauthorize
     */
    function unauthorizeCreator(address creator) external;

    /**
     * @dev Pauses the contract
     */
    function pause() external;

    /**
     * @dev Unpauses the contract
     */
    function unpause() external;

    /**
     * @dev Creates a new quest template
     * @param name The name of the quest template
     * @param description The description of the quest template
     * @param requiredAmount The required amount to complete the quest
     * @param rewardAmount The reward amount for completing the quest
     * @param nftReward Whether to reward an NFT
     * @param nftURI The URI for the NFT
     * @return The ID of the newly created quest template
     */
    function createQuestTemplate(
        string memory name,
        string memory description,
        uint256 requiredAmount,
        uint256 rewardAmount,
        bool nftReward,
        string memory nftURI
    ) external returns (uint256);

    /**
     * @dev Updates an existing quest template
     * @param templateId The ID of the quest template to update
     * @param name The name of the quest template
     * @param description The description of the quest template
     * @param requiredAmount The required amount to complete the quest
     * @param rewardAmount The reward amount for completing the quest
     * @param nftReward Whether to reward an NFT
     * @param nftURI The URI for the NFT
     */
    function updateQuestTemplate(
        uint256 templateId,
        string memory name,
        string memory description,
        uint256 requiredAmount,
        uint256 rewardAmount,
        bool nftReward,
        string memory nftURI
    ) external;

    /**
     * @dev Deactivates a quest template
     * @param templateId The ID of the quest template to deactivate
     */
    function deactivateQuestTemplate(uint256 templateId) external;

    /**
     * @dev Activates a quest template
     * @param templateId The ID of the quest template to activate
     */
    function activateQuestTemplate(uint256 templateId) external;

    /**
     * @dev Creates a quest from a template
     * @param templateId The ID of the quest template
     * @param questType The type of quest
     * @return The ID of the newly created quest
     */
    function createQuestFromTemplate(
        uint256 templateId,
        QuestType questType
    ) external returns (uint256);

    /**
     * @dev Creates a custom quest
     * @param name The name of the quest
     * @param description The description of the quest
     * @param requiredAmount The required amount to complete the quest
     * @param rewardAmount The reward amount for completing the quest
     * @param nftReward Whether to reward an NFT
     * @param nftURI The URI for the NFT
     * @return The ID of the newly created quest
     */
    function createCustomQuest(
        string memory name,
        string memory description,
        uint256 requiredAmount,
        uint256 rewardAmount,
        bool nftReward,
        string memory nftURI
    ) external returns (uint256);

    /**
     * @dev Gets information about a quest template
     * @param templateId The ID of the quest template
     * @return The quest template information
     */
    function getQuestTemplate(uint256 templateId) external view returns (QuestTemplate memory);

    /**
     * @dev Gets all active quest templates with pagination
     * @param offset The offset to start from
     * @param limit The maximum number of templates to return
     * @return Array of template IDs
     */
    function getActiveQuestTemplates(uint256 offset, uint256 limit) external view returns (uint256[] memory);
    
    /**
     * @dev Gets all active quest templates (legacy method, may hit gas limits with many templates)
     * @return Array of template IDs
     */
    function getAllActiveQuestTemplates() external view returns (uint256[] memory);

    /**
     * @dev Creates seasonal quests
     * @param season The season name
     * @param baseReward The base reward amount
     * @return Array of quest IDs
     */
    function createSeasonalQuests(
        string memory season,
        uint256 baseReward
    ) external returns (uint256[] memory);

    /**
     * @dev Creates community challenge quests
     * @param challengeName The challenge name
     * @param targetAmount The target amount for the community
     * @param individualAmount The target amount for individuals
     * @param rewardAmount The reward amount
     * @return The ID of the newly created quest
     */
    function createCommunityChallenge(
        string memory challengeName,
        uint256 targetAmount,
        uint256 individualAmount,
        uint256 rewardAmount
    ) external returns (uint256);

    /**
     * @dev Helper function to create a quest of a specific type
     * @param questType The type of quest
     * @param name The name of the quest
     * @param description The description of the quest
     * @param requiredAmount The required amount to complete the quest
     * @param rewardAmount The reward amount for completing the quest
     * @param nftReward Whether to reward an NFT
     * @param nftURI The URI for the NFT
     * @return The ID of the newly created quest
     */
    function createQuestOfType(
        QuestType questType,
        string memory name,
        string memory description,
        uint256 requiredAmount,
        uint256 rewardAmount,
        bool nftReward,
        string memory nftURI
    ) external returns (uint256);

    /**
     * @dev Sets a quest as completed for a user
     * @param user The user address
     * @param questId The ID of the quest
     * @param completed Whether the quest is completed
     */
    function setQuestCompleted(address user, uint256 questId, bool completed) external;
    
    /**
     * @dev Checks if a quest is completed by a user
     * @param user The user address
     * @param questId The ID of the quest
     * @return Whether the quest is completed
     */
    function isQuestCompleted(address user, uint256 questId) external view returns (bool);

    /**
     * @dev Gets user statistics for quest completion
     * @param user The user to get statistics for
     * @return User statistics
     */
    function getUserStats(address user) external view returns (UserStats memory);

    /**
     * @dev Completes a quest
     * @param questId The ID of the quest to complete
     */
    function completeQuest(uint256 questId) external;
    
    /**
     * @dev Gets all completed quests for a user
     * @param user The user address
     * @return Array of completed quest IDs
     */
    function getCompletedQuests(address user) external view returns (uint256[] memory);
}
