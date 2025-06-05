// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title IStakeNFT
 * @dev Interface for the StakeNFT contract
 */
interface IStakeNFT {
    /**
     * @dev Struct containing information about a stake
     */
    struct StakeInfo {
        uint256 garbageCanId;      // ID of the garbage can
        uint256 stakedAmount;      // Original USDC amount staked
        uint256 sharePercentage;   // Percentage of ownership in basis points (100% = 10000)
        uint256 stakingTimestamp;  // When the stake was created
        uint256 accumulatedRewards; // Rewards earned but not claimed
        uint256 parentTokenId;     // 0 if original, otherwise parent NFT ID
        bool isSplit;              // True if this was created from splitting
    }

    /**
     * @dev Struct containing statistics about a user's stakes
     */
    struct UserStakeStats {
        uint256 totalStaked;       // Total amount staked across all NFTs
        uint256 totalRewards;      // Total rewards accumulated across all NFTs
        uint256 stakeCount;        // Number of stake NFTs owned
        uint256 totalClaimed;      // Total rewards claimed
    }

    /**
     * @dev Struct containing statistics about a garbage can's stakes
     */
    struct GarbageCanStakeStats {
        uint256 totalStaked;       // Total amount staked
        uint256 totalRewards;      // Total rewards accumulated
        uint256 stakeCount;        // Number of stake NFTs
        uint256 stakerCount;       // Number of unique stakers
    }

    /**
     * @dev Emitted when a new stake NFT is minted
     */
    event StakeNFTMinted(uint256 indexed tokenId, address indexed owner, uint256 indexed garbageCanId, uint256 amount);
    
    /**
     * @dev Emitted when rewards are added to a stake NFT
     */
    event RewardsAdded(uint256 indexed tokenId, uint256 amount);
    
    /**
     * @dev Emitted when rewards are claimed from a stake NFT
     */
    event RewardsClaimed(uint256 indexed tokenId, address indexed owner, uint256 amount);
    
    /**
     * @dev Emitted when a stake NFT is split
     */
    event StakeSplit(uint256 indexed originalTokenId, uint256[] newTokenIds);
    
    /**
     * @dev Emitted when stake NFTs are merged
     */
    event StakesMerged(uint256[] indexed originalTokenIds, uint256 newTokenId);

    /**
     * @dev Mints a new stake NFT
     * @param to The address to mint the NFT to
     * @param garbageCanId The ID of the garbage can
     * @param amount The amount staked
     * @param sharePercentage The percentage of ownership in basis points
     * @return The ID of the newly minted token
     */
    function mintStake(
        address to,
        uint256 garbageCanId,
        uint256 amount,
        uint256 sharePercentage
    ) external returns (uint256);

    /**
     * @dev Adds rewards to a stake NFT
     * @param tokenId The ID of the token
     * @param amount The amount of rewards to add
     */
    function addRewards(uint256 tokenId, uint256 amount) external;

    /**
     * @dev Claims rewards from a stake NFT
     * @param tokenId The ID of the token
     * @return The amount of rewards claimed
     */
    function claimRewards(uint256 tokenId) external returns (uint256);

    /**
     * @dev Splits a stake NFT into multiple smaller NFTs
     * @param tokenId The ID of the token to split
     * @param amounts Array of amounts for each new NFT
     * @return Array of new token IDs
     */
    function splitStake(
        uint256 tokenId,
        uint256[] calldata amounts
    ) external returns (uint256[] memory);

    /**
     * @dev Merges multiple stake NFTs into a single NFT
     * @param tokenIds Array of token IDs to merge
     * @return The ID of the newly minted token
     */
    function mergeStakes(
        uint256[] calldata tokenIds
    ) external returns (uint256);

    /**
     * @dev Returns information about a stake
     * @param tokenId The ID of the token
     * @return The stake information
     */
    function getStakeInfo(uint256 tokenId) external view returns (StakeInfo memory);

    /**
     * @dev Returns all token IDs owned by an address
     * @param owner The address to query
     * @return Array of token IDs
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory);

    /**
     * @dev Returns all token IDs for a garbage can
     * @param garbageCanId The ID of the garbage can
     * @return Array of token IDs
     */
    function getTokensByGarbageCan(uint256 garbageCanId) external view returns (uint256[] memory);

    /**
     * @dev Returns all token IDs for a garbage can with pagination
     * @param garbageCanId The ID of the garbage can
     * @param offset The offset to start from
     * @param limit The maximum number of tokens to return
     * @return Array of token IDs
     */
    function getTokensByGarbageCanPaginated(
        uint256 garbageCanId,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory);

    /**
     * @dev Returns the total number of stakes
     * @return The total number of stakes
     */
    function getTotalStakes() external view returns (uint256);

    /**
     * @dev Returns statistics about a user's stakes
     * @param user The address of the user
     * @return The user's stake statistics
     */
    function getUserStakeStats(address user) external view returns (UserStakeStats memory);

    /**
     * @dev Returns statistics about a garbage can's stakes
     * @param garbageCanId The ID of the garbage can
     * @return The garbage can's stake statistics
     */
    function getGarbageCanStakeStats(uint256 garbageCanId) external view returns (GarbageCanStakeStats memory);

    /**
     * @dev Returns the token URI for a token
     * @param tokenId The ID of the token
     * @return The token URI
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);

    /**
     * @dev Returns the owner of a token
     * @param tokenId The ID of the token
     * @return The owner of the token
     */
    function ownerOf(uint256 tokenId) external view returns (address);

    /**
     * @dev Returns the balance of tokens for an address
     * @param owner The address to query
     * @return The balance
     */
    function balanceOf(address owner) external view returns (uint256);

    /**
     * @dev Returns the total supply of tokens
     * @return The total supply
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the name of the token
     * @return The name
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token
     * @return The symbol
     */
    function symbol() external view returns (string memory);
    
    /**
     * @dev Returns the TrashToken contract
     * @return The TrashToken contract
     */
    function trashToken() external view returns (address);
}
