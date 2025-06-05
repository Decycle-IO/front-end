// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IQuestSystem.sol";
import "../interfaces/IRecyclingSystem.sol";
import "../interfaces/ITrashToken.sol";
import "../interfaces/IAchievementNFT.sol";
import "../interfaces/IEmailVerifier.sol";

/**
 * @title QuestSystem
 * @dev System for managing quests, tracking progress, and distributing rewards
 */
contract QuestSystem is IQuestSystem, Ownable, Pausable, ReentrancyGuard {
    /**
     * @dev Error thrown when the caller is not authorized
     */
    error UnauthorizedCaller();

    /**
     * @dev Error thrown when the quest does not exist
     */
    error QuestNotFound();

    /**
     * @dev Error thrown when the quest is not active
     */
    error QuestNotActive();

    /**
     * @dev Error thrown when the email verification fails
     */
    error EmailVerificationFailed();
    
    /**
     * @dev Error thrown when the quest is not completed
     */
    error QuestNotCompleted();
    
    /**
     * @dev Error thrown when the quest rewards have already been claimed
     */
    error QuestAlreadyClaimed();

    /**
     * @dev Error thrown when the quest is already completed
     */
    error QuestAlreadyCompleted();

    /**
     * @dev Error thrown when the wallet is not verified for the email hash
     */
    error WalletNotVerified();

    /**
     * @dev Error thrown when the email hash doesn't match the verified email for the wallet
     */
    error EmailHashMismatch();

    /**
     * @dev Counter for quest IDs
     */
    uint256 private _nextQuestId;

    /**
     * @dev Mapping of quest ID to quest
     */
    mapping(uint256 => Quest) private _quests;

    /**
     * @dev Mapping of quest type to quest IDs
     */
    mapping(QuestType => uint256[]) private _questsByType;

    /**
     * @dev Mapping of wallet address to verified email hash
     */
    mapping(address => bytes32) private _verifiedEmails;

    /**
     * @dev Mapping of email hash to quest ID to progress
     */
    mapping(bytes32 => mapping(uint256 => uint256)) private _questProgress;

    /**
     * @dev Mapping of email hash to quest ID to claimed status
     */
    mapping(bytes32 => mapping(uint256 => bool)) private _claimedQuests;

    /**
     * @dev Mapping of email hash to total recycled amount
     */
    mapping(bytes32 => uint256) private _totalRecycled;

    /**
     * @dev Mapping of email hash to weekly recycled amount
     */
    mapping(bytes32 => mapping(uint256 => uint256)) private _weeklyRecycled;

    /**
     * @dev Mapping of email hash to recycled material types
     */
    mapping(bytes32 => mapping(IRecyclingSystem.RecyclableType => bool)) private _recycledMaterials;

    /**
     * @dev Mapping of addresses authorized to record recycling
     */
    mapping(address => bool) internal _authorizedRecorders;

    /**
     * @dev Mapping of template ID to quest template
     */
    mapping(uint256 => QuestTemplate) private _questTemplates;

    /**
     * @dev Counter for template IDs
     */
    uint256 private _nextTemplateId;

    /**
     * @dev Mapping of addresses authorized to create quests
     */
    mapping(address => bool) internal _authorizedCreators;

    /**
     * @dev Reference to the TrashToken contract
     */
    ITrashToken private _trashToken;

    /**
     * @dev Reference to the AchievementNFT contract
     */
    IAchievementNFT private _achievementNFT;

    /**
     * @dev Reference to the EmailVerifier contract
     */
    IEmailVerifier private _emailVerifier;

    /**
     * @dev Reference to the RecyclingSystem contract
     */
    IRecyclingSystem private _recyclingSystem;
    
    /**
     * @dev Constants for quest requirements
     */
    uint256 private constant QUEST_REQUIRED_RECYCLING_COUNT = 5;
    uint256 private constant QUEST_REQUIRED_STAKE_AMOUNT = 1000 * 10**6; // 1,000 USDC
    uint256 private constant QUEST_REQUIRED_STAKE_DURATION = 30 days;
    uint256 private constant QUEST_DEFAULT_MULTIPLIER = 150; // 1.5x

    /**
     * @dev Constructor
     * @param initialOwner The initial owner of the contract
     * @param trashToken The TrashToken contract
     * @param achievementNFT The AchievementNFT contract
     * @param emailVerifier The EmailVerifier contract
     * @param recyclingSystem The RecyclingSystem contract
     */
    constructor(
        address initialOwner,
        address trashToken,
        address achievementNFT,
        address emailVerifier,
        address recyclingSystem
    ) Ownable(initialOwner) {
        if (trashToken == address(0)) {
            revert("Zero address for TrashToken");
        }
        if (achievementNFT == address(0)) {
            revert("Zero address for AchievementNFT");
        }
        if (emailVerifier == address(0)) {
            revert("Zero address for EmailVerifier");
        }
        if (recyclingSystem == address(0)) {
            revert("Zero address for RecyclingSystem");
        }
        
        _trashToken = ITrashToken(trashToken);
        _achievementNFT = IAchievementNFT(achievementNFT);
        _emailVerifier = IEmailVerifier(emailVerifier);
        _recyclingSystem = IRecyclingSystem(recyclingSystem);
        
        // Authorize the owner as a recorder and creator
        _authorizedRecorders[initialOwner] = true;
        _authorizedCreators[initialOwner] = true;
    }

    /**
     * @dev Modifier to check if the caller is authorized to record recycling
     */
    modifier onlyAuthorizedRecorder() {
        if (!_authorizedRecorders[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedCaller();
        }
        _;
    }

    /**
     * @dev Modifier to check if the caller is authorized to create quests
     */
    modifier onlyAuthorizedCreator() {
        if (!_authorizedCreators[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedCaller();
        }
        _;
    }

    /**
     * @dev Checks if an address is authorized to record recycling
     * @param recorder The address to check
     * @return Whether the address is authorized to record recycling
     */
    function isAuthorizedRecorder(address recorder) external view returns (bool) {
        return _authorizedRecorders[recorder];
    }

    /**
     * @dev Authorizes an address to record recycling
     * @param recorder The address to authorize
     */
    function authorizeRecorder(address recorder) external onlyOwner {
        _authorizedRecorders[recorder] = true;
        emit RecorderAuthorized(recorder);
    }

    /**
     * @dev Unauthorizes an address to record recycling
     * @param recorder The address to unauthorize
     */
    function unauthorizeRecorder(address recorder) external onlyOwner {
        _authorizedRecorders[recorder] = false;
        emit RecorderUnauthorized(recorder);
    }

    /**
     * @dev Checks if an address is authorized to create quests
     * @param creator The address to check
     * @return Whether the address is authorized to create quests
     */
    function isAuthorizedCreator(address creator) external view returns (bool) {
        return _authorizedCreators[creator];
    }

    /**
     * @dev Authorizes an address to create quests
     * @param creator The address to authorize
     */
    function authorizeCreator(address creator) external onlyOwner {
        _authorizedCreators[creator] = true;
        emit CreatorAuthorized(creator);
    }

    /**
     * @dev Unauthorizes an address to create quests
     * @param creator The address to unauthorize
     */
    function unauthorizeCreator(address creator) external onlyOwner {
        _authorizedCreators[creator] = false;
        emit CreatorUnauthorized(creator);
    }

    /**
     * @dev Pauses the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Records recycling activity for a user
     * @param emailHash The hash of the user's email
     * @param materialType The type of material recycled
     * @param amount The amount recycled
     */
    /**
     * @dev Checks if a quest exists and is active
     * @param quest The quest to check
     * @return True if the quest exists and is active
     */
    function isQuestActiveAndValid(Quest memory quest) internal pure returns (bool) {
        // Check if the quest exists (name is not empty) and is active
        return bytes(quest.name).length > 0 && quest.isActive;
    }

    /**
     * @dev Updates quest progress based on recycling activity
     * @param currentProgress The current progress of the quest
     * @param requiredAmount The required amount to complete the quest
     * @param amount The amount to add to the progress
     * @return The updated progress
     */
    function updateQuestProgress(
        uint256 currentProgress,
        uint256 requiredAmount,
        uint256 amount
    ) internal pure returns (uint256) {
        // If the quest is already completed, don't update progress
        if (currentProgress >= requiredAmount) {
            return currentProgress;
        }

        // Update progress and cap it at the required amount
        uint256 newProgress = currentProgress + amount;
        return newProgress > requiredAmount ? requiredAmount : newProgress;
    }

    /**
     * @dev Checks if a quest is completed
     * @param progress The current progress of the quest
     * @param requiredAmount The required amount to complete the quest
     * @return True if the quest is completed
     */
    function isQuestCompleted(
        uint256 progress,
        uint256 requiredAmount
    ) internal pure returns (bool) {
        // If requiredAmount is 0, the quest is automatically completed
        if (requiredAmount == 0) {
            return true;
        }
        return progress >= requiredAmount;
    }
    
    /**
     * @dev Checks if a quest is completed based on user stats
     * @param quest The quest to check
     * @param stats The user's stats
     * @return True if the quest is completed
     */
    function isQuestCompleted(
        Quest memory quest,
        UserStats memory stats
    ) internal pure returns (bool) {
        if (!quest.isActive) {
            return false;
        }
        
        // Check all requirements
        return stats.totalRecycledWeight >= quest.requiredAmount &&
               stats.recyclingCount >= QUEST_REQUIRED_RECYCLING_COUNT &&
               stats.stakedAmount >= QUEST_REQUIRED_STAKE_AMOUNT &&
               stats.stakeDuration >= QUEST_REQUIRED_STAKE_DURATION;
    }
    
    /**
     * @dev Calculates the reward for a quest
     * @param quest The quest
     * @param baseReward The base reward amount
     * @return The calculated reward amount
     */
    function calculateQuestReward(
        Quest memory quest,
        uint256 baseReward
    ) internal pure returns (uint256) {
        // If baseReward is zero, return zero
        if (baseReward == 0) {
            return 0;
        }
        
        // Use the quest's multiplier (150 = 1.5x)
        return baseReward * QUEST_DEFAULT_MULTIPLIER / 100;
    }

    /**
     * @dev Updates material type progress for the Material Master quest
     * @param recycledMaterials Mapping of recycled material types
     * @param materialType The material type being recycled
     * @return The number of different material types recycled
     */
    function updateMaterialTypeProgress(
        mapping(IRecyclingSystem.RecyclableType => bool) storage recycledMaterials,
        IRecyclingSystem.RecyclableType materialType
    ) internal returns (uint256) {
        // Mark the material type as recycled
        recycledMaterials[materialType] = true;

        // Count the number of different material types recycled
        uint256 materialTypeCount = 0;
        for (uint i = 0; i <= uint(IRecyclingSystem.RecyclableType.OTHER); i++) {
            if (recycledMaterials[IRecyclingSystem.RecyclableType(i)]) {
                materialTypeCount++;
            }
        }

        return materialTypeCount;
    }

    /**
     * @dev Updates weekly recycling progress
     * @param weeklyRecycled Mapping of weekly recycled amounts
     * @param amount The amount being recycled
     * @return The total amount recycled in the current week
     */
    function updateWeeklyProgress(
        mapping(uint256 => uint256) storage weeklyRecycled,
        uint256 amount
    ) internal returns (uint256) {
        // Get the current week number
        uint256 currentWeek = block.timestamp / 1 weeks;

        // Update the weekly recycled amount
        weeklyRecycled[currentWeek] += amount;

        return weeklyRecycled[currentWeek];
    }

    /**
     * @dev Validates that a user can claim rewards for a quest
     * @param emailHash The hash of the user's email
     * @param claimedQuests Mapping of claimed quests
     * @param questProgress Mapping of quest progress
     * @param quest The quest to claim rewards for
     * @param questId The ID of the quest
     */
    function validateClaimRewards(
        bytes32 emailHash,
        mapping(bytes32 => mapping(uint256 => bool)) storage claimedQuests,
        mapping(bytes32 => mapping(uint256 => uint256)) storage questProgress,
        Quest memory quest,
        uint256 questId
    ) internal view {
        // Check if the quest has already been claimed
        if (claimedQuests[emailHash][questId]) {
            revert QuestAlreadyClaimed();
        }

        // Check if the quest has been completed
        if (questProgress[emailHash][questId] < quest.requiredAmount) {
            revert QuestNotCompleted();
        }
    }

    /**
     * @dev Gets the quest type name as a string
     * @param questType The quest type
     * @return The quest type name
     */
    function getQuestTypeName(QuestType questType) internal pure returns (string memory) {
        if (questType == QuestType.FIRST_RECYCLER) {
            return "First Recycler";
        } else if (questType == QuestType.WEEKLY_WARRIOR) {
            return "Weekly Warrior";
        } else if (questType == QuestType.EARTH_CHAMPION) {
            return "Earth Champion";
        } else if (questType == QuestType.MATERIAL_MASTER) {
            return "Material Master";
        } else {
            return "Custom";
        }
    }

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
    ) external onlyAuthorizedRecorder whenNotPaused {
        // Update total recycled amount
        _totalRecycled[emailHash] += amount;
        
        // Update weekly recycled amount
        uint256 weeklyAmount = updateWeeklyProgress(_weeklyRecycled[emailHash], amount);
        
        // Update material type progress
        uint256 materialTypeCount = updateMaterialTypeProgress(_recycledMaterials[emailHash], materialType);
        
        // Update quest progress
        _updateQuestProgress(emailHash, QuestType.FIRST_RECYCLER, amount);
        _updateQuestProgress(emailHash, QuestType.WEEKLY_WARRIOR, weeklyAmount);
        _updateQuestProgress(emailHash, QuestType.EARTH_CHAMPION, _totalRecycled[emailHash]);
        _updateQuestProgress(emailHash, QuestType.MATERIAL_MASTER, materialTypeCount);
        
        emit RecyclingRecorded(emailHash, materialType, amount);
    }

    /**
     * @dev Verifies a user's email and links it to their wallet address
     * @param emailHash The hash of the user's email
     * @param proof The zkemail proof
     */
    function verifyEmail(bytes32 emailHash, bytes memory proof) external whenNotPaused nonReentrant {
        // Create the unverified email data with the proof
        string[] memory dnsRecords = new string[](0);
        
        IEmailVerifier.UnverifiedEmailData memory unverifiedEmail = IEmailVerifier.UnverifiedEmailData({
            email: "", // The actual email is derived from the proof
            dnsRecords: dnsRecords,
            signature: proof
        });
        
        // Use the EmailVerifier contract to verify the email
        IEmailVerifier.VerifiedEmailResult memory result = _emailVerifier.verifyEmail(unverifiedEmail, msg.sender);
        
        // Ensure the email hash matches and is valid
        if (result.emailHash != emailHash || !result.isValid) {
            revert EmailVerificationFailed();
        }
        
        // Link the wallet to the email hash
        _verifiedEmails[msg.sender] = emailHash;
        
        emit EmailVerified(emailHash, msg.sender);
    }

    /**
     * @dev Claims rewards for completed quests
     * @param questType The type of quest to claim rewards for
     * @param questId The ID of the quest to claim rewards for
     */
    function claimRewards(QuestType questType, uint256 questId) external whenNotPaused nonReentrant {
        Quest storage quest = _quests[questId];
        
        // Validate that the quest exists and is active
        if (!isQuestActiveAndValid(quest)) {
            revert QuestNotActive();
        }
        
        // Get the verified email hash for the caller's wallet
        bytes32 emailHash = _verifiedEmails[msg.sender];
        
        // Verify that the caller has a verified email
        if (emailHash == bytes32(0)) {
            revert WalletNotVerified();
        }
        
        // Validate that the quest is completed and not already claimed
        validateClaimRewards(
            emailHash,
            _claimedQuests,
            _questProgress,
            quest,
            questId
        );
        
        // Mark the quest as claimed
        _claimedQuests[emailHash][questId] = true;
        
        // Mint TRASH tokens to the user
        if (quest.rewardAmount > 0) {
            _trashToken.mint(msg.sender, quest.rewardAmount);
        }
        
        // Mint achievement NFT if applicable
        uint256 nftId = 0;
        if (quest.nftReward) {
                nftId = _achievementNFT.mintAchievement(
                msg.sender,
                questId,
                getQuestTypeName(questType),
                quest.description,
                quest.nftURI
            );
        }
        
        emit RewardClaimed(msg.sender, questType, questId, quest.rewardAmount, nftId);
    }

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
    ) external onlyAuthorizedCreator whenNotPaused returns (uint256) {
        uint256 questId = _nextQuestId++;
        
        _quests[questId] = Quest({
            name: name,
            description: description,
            requiredAmount: requiredAmount,
            rewardAmount: rewardAmount,
            nftReward: nftReward,
            nftURI: nftURI,
            isActive: true
        });
        
        _questsByType[questType].push(questId);
        
        emit QuestCreated(questId, questType, name, requiredAmount);
        
        return questId;
    }

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
    ) external onlyAuthorizedCreator whenNotPaused {
        if (bytes(_quests[questId].name).length == 0) {
            revert QuestNotFound();
        }
        
        _quests[questId] = Quest({
            name: name,
            description: description,
            requiredAmount: requiredAmount,
            rewardAmount: rewardAmount,
            nftReward: nftReward,
            nftURI: nftURI,
            isActive: true
        });
        
        emit QuestUpdated(questId, questType, name, requiredAmount);
    }

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
    ) {
        Quest memory quest = _quests[questId];
        
        if (bytes(quest.name).length == 0) {
            revert QuestNotFound();
        }
        
        progress = _questProgress[emailHash][questId];
        required = quest.requiredAmount;
        completed = isQuestCompleted(progress, required);
        claimed = _claimedQuests[emailHash][questId];
    }

    /**
     * @dev Gets information about a quest
     * @param questId The ID of the quest
     * @return The quest information
     */
    function getQuest(uint256 questId) external view returns (Quest memory) {
        Quest memory quest = _quests[questId];
        
        if (bytes(quest.name).length == 0) {
            revert QuestNotFound();
        }
        
        return quest;
    }

    /**
     * @dev Gets all quests of a specific type
     * @param questType The type of quest
     * @return Array of quest IDs
     */
    function getQuestsByType(QuestType questType) external view returns (uint256[] memory) {
        return _questsByType[questType];
    }

    /**
     * @dev Gets all active quests with pagination
     * @param offset The offset to start from
     * @param limit The maximum number of quests to return
     * @return Array of quest IDs
     */
    function getActiveQuests(uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active quests
        for (uint256 i = 0; i < _nextQuestId; i++) {
            if (_quests[i].isActive) {
                activeCount++;
            }
        }
        
        // Adjust limit if it exceeds the total count
        if (offset >= activeCount) {
            return new uint256[](0);
        }
        
        uint256 remaining = activeCount - offset;
        uint256 actualLimit = remaining < limit ? remaining : limit;
        
        // Create array of active quest IDs
        uint256[] memory activeQuests = new uint256[](actualLimit);
        uint256 index = 0;
        uint256 skipped = 0;
        
        for (uint256 i = 0; i < _nextQuestId && index < actualLimit; i++) {
            if (_quests[i].isActive) {
                if (skipped < offset) {
                    skipped++;
                } else {
                    activeQuests[index] = i;
                    index++;
                }
            }
        }
        
        return activeQuests;
    }
    
    /**
     * @dev Gets all active quests (legacy method, may hit gas limits with many quests)
     * @return Array of quest IDs
     */
    function getAllActiveQuests() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active quests
        for (uint256 i = 0; i < _nextQuestId; i++) {
            if (_quests[i].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active quest IDs
        uint256[] memory activeQuests = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _nextQuestId; i++) {
            if (_quests[i].isActive) {
                activeQuests[index] = i;
                index++;
            }
        }
        
        return activeQuests;
    }
    
    /**
     * @dev Gets the verified email hash for a wallet address
     * @return The email hash associated with the wallet, or bytes32(0) if not verified
     */
    function getVerifiedEmail() external view returns (bytes32) {
        return _verifiedEmails[msg.sender];
    }

    /**
     * @dev Updates quest progress for a specific quest type
     * @param emailHash The hash of the user's email
     * @param questType The type of quest
     * @param amount The amount to add to the progress
     */
    function _updateQuestProgress(bytes32 emailHash, QuestType questType, uint256 amount) internal {
        uint256[] memory questIds = _questsByType[questType];
        
        for (uint256 i = 0; i < questIds.length; i++) {
            uint256 questId = questIds[i];
            Quest memory quest = _quests[questId];
            
            if (isQuestActiveAndValid(quest)) {
                _questProgress[emailHash][questId] = updateQuestProgress(
                    _questProgress[emailHash][questId],
                    quest.requiredAmount,
                    amount
                );
                
                // Check if the quest is completed
                if (isQuestCompleted(_questProgress[emailHash][questId], quest.requiredAmount)) {
                    emit QuestCompleted(emailHash, questType, questId);
                }
            }
        }
    }

    /**
     * @dev Sets a quest as completed for a user
     * @param user The user address
     * @param questId The ID of the quest
     * @param completed Whether the quest is completed
     */
    function setQuestCompleted(address user, uint256 questId, bool completed) external onlyOwner {
        bytes32 emailHash = _verifiedEmails[user];
        if (emailHash == bytes32(0)) {
            // If user doesn't have a verified email, create a mock one
            emailHash = keccak256(abi.encodePacked(user));
            _verifiedEmails[user] = emailHash;
        }
        
        if (completed) {
            // Mark quest as completed by setting progress to required amount
            Quest memory quest = _quests[questId];
            _questProgress[emailHash][questId] = quest.requiredAmount;
        } else {
            // Mark quest as not completed by setting progress to 0
            _questProgress[emailHash][questId] = 0;
        }
        
        // Set claimed status
        _claimedQuests[emailHash][questId] = false;
    }
    
    /**
     * @dev Checks if a quest is completed by a user
     * @param user The user address
     * @param questId The ID of the quest
     * @return Whether the quest is completed
     */
    function isQuestCompleted(address user, uint256 questId) external view returns (bool) {
        bytes32 emailHash = _verifiedEmails[user];
        if (emailHash == bytes32(0)) {
            return false;
        }
        
        Quest memory quest = _quests[questId];
        if (!quest.isActive) {
            return false;
        }
        
        uint256 progress = _questProgress[emailHash][questId];
        return isQuestCompleted(progress, quest.requiredAmount);
    }
    
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
    ) external onlyAuthorizedCreator whenNotPaused returns (uint256) {
        uint256 questId = _nextQuestId++;
        
        _quests[questId] = Quest({
            name: name,
            description: description,
            requiredAmount: requiredAmount,
            rewardAmount: rewardAmount,
            nftReward: nftReward,
            nftURI: nftURI,
            isActive: true
        });
        
        _questsByType[questType].push(questId);
        
        emit QuestCreated(questId, questType, name, requiredAmount);
        
        return questId;
    }

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
    ) external onlyAuthorizedCreator whenNotPaused nonReentrant returns (uint256) {
        uint256 templateId = _nextTemplateId++;
        
        _questTemplates[templateId] = QuestTemplate({
            name: name,
            description: description,
            requiredAmount: requiredAmount,
            rewardAmount: rewardAmount,
            nftReward: nftReward,
            nftURI: nftURI,
            isActive: true
        });
        
        emit QuestTemplateCreated(templateId, name, requiredAmount);
        
        return templateId;
    }

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
    ) external onlyAuthorizedCreator whenNotPaused nonReentrant {
        if (bytes(_questTemplates[templateId].name).length == 0) {
            revert QuestNotFound();
        }
        
        _questTemplates[templateId] = QuestTemplate({
            name: name,
            description: description,
            requiredAmount: requiredAmount,
            rewardAmount: rewardAmount,
            nftReward: nftReward,
            nftURI: nftURI,
            isActive: true
        });
        
        emit QuestTemplateUpdated(templateId, name, requiredAmount);
    }

    /**
     * @dev Deactivates a quest template
     * @param templateId The ID of the quest template to deactivate
     */
    function deactivateQuestTemplate(uint256 templateId) external onlyAuthorizedCreator whenNotPaused {
        if (bytes(_questTemplates[templateId].name).length == 0) {
            revert QuestNotFound();
        }
        
        _questTemplates[templateId].isActive = false;
    }

    /**
     * @dev Activates a quest template
     * @param templateId The ID of the quest template to activate
     */
    function activateQuestTemplate(uint256 templateId) external onlyAuthorizedCreator whenNotPaused {
        if (bytes(_questTemplates[templateId].name).length == 0) {
            revert QuestNotFound();
        }
        
        _questTemplates[templateId].isActive = true;
    }

    /**
     * @dev Creates a quest from a template
     * @param templateId The ID of the quest template
     * @param questType The type of quest
     * @return The ID of the newly created quest
     */
    function createQuestFromTemplate(
        uint256 templateId,
        QuestType questType
    ) external onlyAuthorizedCreator whenNotPaused nonReentrant returns (uint256) {
        QuestTemplate memory template = _questTemplates[templateId];
        
        if (bytes(template.name).length == 0) {
            revert QuestNotFound();
        }
        
        if (!template.isActive) {
            revert QuestNotActive();
        }
        
        uint256 questId = this.createQuest(
            questType,
            template.name,
            template.description,
            template.requiredAmount,
            template.rewardAmount,
            template.nftReward,
            template.nftURI
        );
        
        emit QuestCreatedFromTemplate(templateId, questId, questType);
        
        return questId;
    }

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
    ) external onlyAuthorizedCreator whenNotPaused nonReentrant returns (uint256) {
        uint256 questId = _nextQuestId++;
        
        _quests[questId] = Quest({
            name: name,
            description: description,
            requiredAmount: requiredAmount,
            rewardAmount: rewardAmount,
            nftReward: nftReward,
            nftURI: nftURI,
            isActive: true
        });
        
        _questsByType[QuestType.CUSTOM].push(questId);
        
        emit QuestCreated(questId, QuestType.CUSTOM, name, requiredAmount);
        
        return questId;
    }

    /**
     * @dev Gets information about a quest template
     * @param templateId The ID of the quest template
     * @return The quest template information
     */
    function getQuestTemplate(uint256 templateId) external view returns (QuestTemplate memory) {
        if (bytes(_questTemplates[templateId].name).length == 0) {
            revert QuestNotFound();
        }
        
        return _questTemplates[templateId];
    }

    /**
     * @dev Gets all active quest templates with pagination
     * @param offset The offset to start from
     * @param limit The maximum number of templates to return
     * @return Array of template IDs
     */
    function getActiveQuestTemplates(uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active templates
        for (uint256 i = 0; i < _nextTemplateId; i++) {
            if (_questTemplates[i].isActive) {
                activeCount++;
            }
        }
        
        // Adjust limit if it exceeds the total count
        if (offset >= activeCount) {
            return new uint256[](0);
        }
        
        uint256 remaining = activeCount - offset;
        uint256 actualLimit = remaining < limit ? remaining : limit;
        
        // Create array of active template IDs
        uint256[] memory activeTemplates = new uint256[](actualLimit);
        uint256 index = 0;
        uint256 skipped = 0;
        
        for (uint256 i = 0; i < _nextTemplateId && index < actualLimit; i++) {
            if (_questTemplates[i].isActive) {
                if (skipped < offset) {
                    skipped++;
                } else {
                    activeTemplates[index] = i;
                    index++;
                }
            }
        }
        
        return activeTemplates;
    }
    
    /**
     * @dev Gets all active quest templates (legacy method, may hit gas limits with many templates)
     * @return Array of template IDs
     */
    function getAllActiveQuestTemplates() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active templates
        for (uint256 i = 0; i < _nextTemplateId; i++) {
            if (_questTemplates[i].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active template IDs
        uint256[] memory activeTemplates = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _nextTemplateId; i++) {
            if (_questTemplates[i].isActive) {
                activeTemplates[index] = i;
                index++;
            }
        }
        
        return activeTemplates;
    }

    /**
     * @dev Creates seasonal quests
     * @param season The season name
     * @param baseReward The base reward amount
     * @return Array of quest IDs
     */
    function createSeasonalQuests(
        string memory season,
        uint256 baseReward
    ) external onlyAuthorizedCreator whenNotPaused nonReentrant returns (uint256[] memory) {
        uint256[] memory questIds = new uint256[](3);
        
        // Create easy quest
        questIds[0] = this.createQuest(
            QuestType.CUSTOM,
            string(abi.encodePacked(season, " Recycler - Easy")),
            string(abi.encodePacked("Recycle 5 items during the ", season, " season")),
            5,
            baseReward,
            false,
            ""
        );
        
        // Create medium quest
        questIds[1] = this.createQuest(
            QuestType.CUSTOM,
            string(abi.encodePacked(season, " Recycler - Medium")),
            string(abi.encodePacked("Recycle 15 items during the ", season, " season")),
            15,
            baseReward * 2,
            false,
            ""
        );
        
        // Create hard quest
        questIds[2] = this.createQuest(
            QuestType.CUSTOM,
            string(abi.encodePacked(season, " Recycler - Hard")),
            string(abi.encodePacked("Recycle 30 items during the ", season, " season")),
            30,
            baseReward * 4,
            true,
            string(abi.encodePacked("ipfs://Qm", season, "Champion"))
        );
        
        return questIds;
    }

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
    ) external onlyAuthorizedCreator whenNotPaused nonReentrant returns (uint256) {
        uint256 questId = this.createQuest(
            QuestType.CUSTOM,
            string(abi.encodePacked("Community Challenge: ", challengeName)),
            string(abi.encodePacked("Help the community recycle ", _toString(targetAmount), " items. Your target: ", _toString(individualAmount))),
            individualAmount,
            rewardAmount,
            true,
            string(abi.encodePacked("ipfs://QmCommunity", challengeName))
        );
        
        return questId;
    }
    
    /**
     * @dev Gets user statistics for quest completion
     * @param user The user to get statistics for
     * @return User statistics
     */
    function getUserStats(address user) external view returns (UserStats memory) {
        UserStats memory stats;
        
        // Get recycling stats
        stats.totalRecycledWeight = _recyclingSystem.getUserRecycledWeight(user);
        stats.recyclingCount = _recyclingSystem.getUserRecyclingCount(user);
        
        // Get staking stats
        stats.stakedAmount = _recyclingSystem.getUserStakedAmount(user);
        stats.stakeDuration = _recyclingSystem.getUserStakeDuration(user);
        
        return stats;
    }
    
    /**
     * @dev Completes a quest
     * @param questId The ID of the quest to complete
     */
    function completeQuest(uint256 questId) external whenNotPaused nonReentrant {
        // Check if quest is completed
        if (!this.isQuestCompleted(msg.sender, questId)) {
            revert QuestNotCompleted();
        }
        
        // Get quest status
        (uint256 progress, uint256 required, bool completed, bool claimed) = 
            this.getQuestStatus(bytes32(0), QuestType.CUSTOM, questId);
        
        // Check if quest is already completed
        if (completed) {
            revert QuestAlreadyCompleted();
        }
        
        // Get quest
        Quest memory quest = this.getQuest(questId);
        
        // Claim rewards for the quest
        this.claimRewards(QuestType.CUSTOM, questId);
        
        // Mint achievement NFT if applicable
        if (address(_achievementNFT) != address(0)) {
            _achievementNFT.mintAchievement(
                msg.sender,
                questId,
                "Quest Completion",
                quest.description,
                ""  // Empty token URI, will use default
            );
        }
    }
    
    /**
     * @dev Gets all completed quests for a user
     * @param user The user address
     * @return Array of completed quest IDs
     */
    function getCompletedQuests(address user) external view returns (uint256[] memory) {
        // Get all active quests
        uint256[] memory activeQuestIds = this.getAllActiveQuests();
        
        // Count completed quests
        uint256 completedCount = 0;
        for (uint256 i = 0; i < activeQuestIds.length; i++) {
            (uint256 progress, uint256 required, bool completed, bool claimed) = 
                this.getQuestStatus(bytes32(0), QuestType.CUSTOM, activeQuestIds[i]);
            
            if (completed || claimed) {
                completedCount++;
            }
        }
        
        // Create array to store completed quest IDs
        uint256[] memory completedQuestIds = new uint256[](completedCount);
        
        // Populate the array with completed quest IDs
        uint256 index = 0;
        for (uint256 i = 0; i < activeQuestIds.length && index < completedCount; i++) {
            (uint256 progress, uint256 required, bool completed, bool claimed) = 
                this.getQuestStatus(bytes32(0), QuestType.CUSTOM, activeQuestIds[i]);
            
            if (completed || claimed) {
                completedQuestIds[index] = activeQuestIds[i];
                index++;
            }
        }
        
        return completedQuestIds;
    }

    /**
     * @dev Converts a uint256 to its string representation
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
}
