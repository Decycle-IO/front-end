// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title IAchievementNFT
 * @dev Interface for the AchievementNFT contract
 */
interface IAchievementNFT {
    /**
     * @dev Struct containing information about an achievement
     */
    struct AchievementInfo {
        uint256 questId;           // ID of the quest completed
        uint256 completionTime;    // When the achievement was earned
        string achievementType;    // Type of achievement (e.g., "First Recycler")
        string metadata;           // Additional metadata about the achievement
    }

    /**
     * @dev Emitted when a new achievement NFT is minted
     */
    event AchievementNFTMinted(uint256 indexed tokenId, address indexed owner, uint256 indexed questId);

    /**
     * @dev Mints a new achievement NFT
     * @param to The address to mint the NFT to
     * @param questId The ID of the quest that was completed
     * @param achievementType The type of achievement
     * @param metadata Additional metadata about the achievement
     * @param tokenURI The URI for the token metadata
     * @return The ID of the newly minted token
     */
    function mintAchievement(
        address to,
        uint256 questId,
        string memory achievementType,
        string memory metadata,
        string memory tokenURI
    ) external returns (uint256);

    /**
     * @dev Returns information about an achievement
     * @param tokenId The ID of the token
     * @return The achievement information
     */
    function getAchievementInfo(uint256 tokenId) external view returns (AchievementInfo memory);

    /**
     * @dev Returns the quest ID associated with a token
     * @param tokenId The ID of the token
     * @return The ID of the quest
     */
    function getQuestId(uint256 tokenId) external view returns (uint256);

    /**
     * @dev Returns all token IDs owned by an address
     * @param owner The address to query
     * @return Array of token IDs
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory);

    /**
     * @dev Returns all token IDs for a quest
     * @param questId The ID of the quest
     * @return Array of token IDs
     */
    function getTokensByQuest(uint256 questId) external view returns (uint256[] memory);

    /**
     * @dev Returns the token URI for a token
     * @param tokenId The ID of the token
     * @return The token URI
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);
}
