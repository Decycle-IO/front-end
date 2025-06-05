// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import "../../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IRecyclingSystem.sol";
import "../interfaces/IStakeNFT.sol";
import "../interfaces/ITrashToken.sol";
import "../libraries/RewardCalculator.sol";

/**
 * @title RecyclingSystem
 * @dev System for managing garbage cans, recycling, and rewards
 */
contract RecyclingSystem is IRecyclingSystem, Ownable, Pausable, ReentrancyGuard {
    /**
     * @dev Default purchase percentage (50% of the garbage can value)
     */
    uint256 private constant DEFAULT_PURCHASE_PERCENTAGE = 5000; // 50% in basis points (100% = 10000)
    /**
     * @dev Error thrown when the caller is not authorized
     */
    error UnauthorizedCaller();

    /**
     * @dev Error thrown when the garbage can does not exist
     */
    error GarbageCanNotFound();

    /**
     * @dev Error thrown when the garbage can is not active
     */
    error GarbageCanNotActive();

    /**
     * @dev Error thrown when the garbage can is locked
     */
    error GarbageCanLocked();

    /**
     * @dev Error thrown when the stake amount is insufficient
     */
    error InsufficientStake();

    /**
     * @dev Error thrown when the payment amount is insufficient
     */
    error InsufficientPayment();

    /**
     * @dev Struct containing information about a pending garbage can
     */
    struct PendingGarbageCan {
        string location;
        uint256 targetAmount;
        uint256 currentAmount;
        bool isDeployed;
        mapping(address => uint256) stakes;
    }

    /**
     * @dev Struct containing information about a garbage can
     */
    struct GarbageCan {
        string location;
        uint256 currentValue;
        bool isActive;
        bool isLocked;
        uint256 deploymentTimestamp;
        uint256 lastEmptiedTimestamp;
        uint256 totalStaked;
        mapping(RecyclableType => uint256) fillLevels;
    }

    /**
     * @dev Counter for pending garbage can IDs
     */
    uint256 private _nextPendingGarbageCanId;

    /**
     * @dev Counter for garbage can IDs
     */
    uint256 private _nextGarbageCanId;

    /**
     * @dev Mapping of pending garbage can ID to pending garbage can
     */
    mapping(uint256 => PendingGarbageCan) private _pendingGarbageCans;

    /**
     * @dev Mapping of garbage can ID to garbage can
     */
    mapping(uint256 => GarbageCan) private _garbageCans;

    /**
     * @dev Mapping of addresses authorized to update fill levels
     */
    mapping(address => bool) internal _authorizedUpdaters;

    /**
     * @dev Mapping of addresses authorized to deploy garbage cans
     */
    mapping(address => bool) internal _authorizedDeployers;
    
    /**
     * @dev Mapping of user to recycled weight
     */
    mapping(address => uint256) private _userRecycledWeight;
    
    /**
     * @dev Mapping of user to recycling count
     */
    mapping(address => uint256) private _userRecyclingCount;
    
    /**
     * @dev Mapping of user to staked amount
     */
    mapping(address => uint256) private _userStakedAmount;
    
    /**
     * @dev Mapping of user to stake duration
     */
    mapping(address => uint256) private _userStakeDuration;

    /**
     * @dev Reference to the USDC token contract
     */
    IERC20 private _usdcToken;

    /**
     * @dev Reference to the StakeNFT contract
     */
    IStakeNFT private _stakeNFT;

    /**
     * @dev Reference to the TrashToken contract
     */
    ITrashToken private _trashToken;
    
    /**
     * @dev Purchase percentage in basis points (100% = 10000)
     * This determines what percentage of the garbage can value the collector pays
     */
    uint256 private _purchasePercentage;

    /**
     * @dev Emitted when an updater is authorized
     */
    event UpdaterAuthorized(address indexed updater);

    /**
     * @dev Emitted when an updater is unauthorized
     */
    event UpdaterUnauthorized(address indexed updater);

    /**
     * @dev Emitted when a deployer is authorized
     */
    event DeployerAuthorized(address indexed deployer);

    /**
     * @dev Emitted when a deployer is unauthorized
     */
    event DeployerUnauthorized(address indexed deployer);

    /**
     * @dev Constructor
     * @param initialOwner The initial owner of the contract
     * @param usdcToken The USDC token contract
     * @param stakeNFT The StakeNFT contract
     * @param trashToken The TrashToken contract
     */
    constructor(
        address initialOwner,
        address usdcToken,
        address stakeNFT,
        address trashToken
    ) Ownable(initialOwner) {
        if (usdcToken == address(0)) {
            revert("Zero address for USDC");
        }
        if (stakeNFT == address(0)) {
            revert("Zero address for StakeNFT");
        }
        if (trashToken == address(0)) {
            revert("Zero address for TrashToken");
        }
        
        _usdcToken = IERC20(usdcToken);
        _stakeNFT = IStakeNFT(stakeNFT);
        _trashToken = ITrashToken(trashToken);
        
        // Set default purchase percentage
        _purchasePercentage = DEFAULT_PURCHASE_PERCENTAGE;
        
        // Authorize the owner as an updater and deployer
        _authorizedUpdaters[initialOwner] = true;
        _authorizedDeployers[initialOwner] = true;
    }

    /**
     * @dev Modifier to check if the caller is authorized to update fill levels
     */
    modifier onlyAuthorizedUpdater() {
        if (!_authorizedUpdaters[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedCaller();
        }
        _;
    }

    /**
     * @dev Modifier to check if the caller is authorized to deploy garbage cans
     */
    modifier onlyAuthorizedDeployer() {
        if (!_authorizedDeployers[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedCaller();
        }
        _;
    }

    /**
     * @dev Checks if an address is authorized to update fill levels
     * @param updater The address to check
     * @return Whether the address is authorized to update fill levels
     */
    function isAuthorizedUpdater(address updater) external view returns (bool) {
        return _authorizedUpdaters[updater];
    }

    /**
     * @dev Checks if an address is authorized to deploy garbage cans
     * @param deployer The address to check
     * @return Whether the address is authorized to deploy garbage cans
     */
    function isAuthorizedDeployer(address deployer) external view returns (bool) {
        return _authorizedDeployers[deployer];
    }

    /**
     * @dev Authorizes an address to update fill levels
     * @param updater The address to authorize
     */
    function authorizeUpdater(address updater) external onlyOwner {
        if (updater == address(0)) {
            revert("Zero address for updater");
        }
        if (_authorizedUpdaters[updater]) {
            revert("Already authorized updater");
        }
        _authorizedUpdaters[updater] = true;
        emit UpdaterAuthorized(updater);
    }

    /**
     * @dev Unauthorizes an address to update fill levels
     * @param updater The address to unauthorize
     */
    function unauthorizeUpdater(address updater) external onlyOwner {
        if (updater == address(0)) {
            revert("Zero address for updater");
        }
        if (!_authorizedUpdaters[updater]) {
            revert("Not an authorized updater");
        }
        _authorizedUpdaters[updater] = false;
        emit UpdaterUnauthorized(updater);
    }

    /**
     * @dev Authorizes an address to deploy garbage cans
     * @param deployer The address to authorize
     */
    function authorizeDeployer(address deployer) external onlyOwner {
        if (deployer == address(0)) {
            revert("Zero address for deployer");
        }
        if (_authorizedDeployers[deployer]) {
            revert("Already authorized deployer");
        }
        _authorizedDeployers[deployer] = true;
        emit DeployerAuthorized(deployer);
    }

    /**
     * @dev Unauthorizes an address to deploy garbage cans
     * @param deployer The address to unauthorize
     */
    function unauthorizeDeployer(address deployer) external onlyOwner {
        if (deployer == address(0)) {
            revert("Zero address for deployer");
        }
        if (!_authorizedDeployers[deployer]) {
            revert("Not an authorized deployer");
        }
        _authorizedDeployers[deployer] = false;
        emit DeployerUnauthorized(deployer);
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
     * @dev Creates a new pending garbage can that needs staking
     * @param location The physical location of the garbage can
     * @param targetAmount The amount of USDC needed to deploy the garbage can
     * @return The ID of the newly created pending garbage can
     */
    function createPendingGarbageCan(string memory location, uint256 targetAmount) external whenNotPaused returns (uint256) {
        if (bytes(location).length == 0) {
            revert("Empty location");
        }
        if (targetAmount == 0) {
            revert("Zero target amount");
        }
        uint256 pendingGarbageCanId = _nextPendingGarbageCanId++;
        
        PendingGarbageCan storage pendingGarbageCan = _pendingGarbageCans[pendingGarbageCanId];
        pendingGarbageCan.location = location;
        pendingGarbageCan.targetAmount = targetAmount;
        pendingGarbageCan.currentAmount = 0;
        pendingGarbageCan.isDeployed = false;
        
        emit GarbageCanCreated(pendingGarbageCanId, location);
        
        return pendingGarbageCanId;
    }

    /**
     * @dev Deposits a stake for a pending garbage can
     * @param pendingGarbageCanId The ID of the pending garbage can
     * @param amount The amount to stake
     * @return The ID of the newly minted stake NFT
     */
    function depositStake(uint256 pendingGarbageCanId, uint256 amount) external whenNotPaused returns (uint256) {
        PendingGarbageCan storage pendingGarbageCan = _pendingGarbageCans[pendingGarbageCanId];
        
        // Check if the pending garbage can exists and is not deployed
        if (bytes(pendingGarbageCan.location).length == 0) {
            revert GarbageCanNotFound();
        }
        
        if (pendingGarbageCan.isDeployed) {
            revert GarbageCanNotActive();
        }
        
        // Transfer USDC from the user to this contract
        bool success = _usdcToken.transferFrom(msg.sender, address(this), amount);
        if (!success) {
            revert InsufficientPayment();
        }
        
        // Update the pending garbage can
        pendingGarbageCan.stakes[msg.sender] += amount;
        pendingGarbageCan.currentAmount += amount;
        
        // Calculate the share percentage in basis points (1/100 of a percent)
        uint256 sharePercentage = (amount * 10000) / pendingGarbageCan.targetAmount;
        
        // Mint a stake NFT to the user
        uint256 tokenId = _stakeNFT.mintStake(
            msg.sender,
            pendingGarbageCanId,
            amount,
            sharePercentage
        );
        
        emit StakeDeposited(pendingGarbageCanId, msg.sender, amount);
        
        return tokenId;
    }

    /**
     * @dev Deploys a garbage can
     * @param pendingGarbageCanId The ID of the pending garbage can
     * @return The ID of the newly deployed garbage can
     */
    function deployGarbageCan(uint256 pendingGarbageCanId) external onlyAuthorizedDeployer whenNotPaused returns (uint256) {
        PendingGarbageCan storage pendingGarbageCan = _pendingGarbageCans[pendingGarbageCanId];
        
        // Check if the pending garbage can exists and is not deployed
        if (bytes(pendingGarbageCan.location).length == 0) {
            revert GarbageCanNotFound();
        }
        
        if (pendingGarbageCan.isDeployed) {
            revert GarbageCanNotActive();
        }
        
        // Check if enough stake has been collected
        if (pendingGarbageCan.currentAmount < pendingGarbageCan.targetAmount) {
            revert InsufficientStake();
        }
        
        // Create a new garbage can
        uint256 garbageCanId = _nextGarbageCanId++;
        
        GarbageCan storage garbageCan = _garbageCans[garbageCanId];
        garbageCan.location = pendingGarbageCan.location;
        garbageCan.currentValue = 0;
        garbageCan.isActive = true;
        garbageCan.isLocked = false;
        garbageCan.deploymentTimestamp = block.timestamp;
        garbageCan.lastEmptiedTimestamp = block.timestamp;
        garbageCan.totalStaked = pendingGarbageCan.currentAmount;
        
        // Mark the pending garbage can as deployed
        pendingGarbageCan.isDeployed = true;
        
        emit GarbageCanDeployed(pendingGarbageCanId, garbageCanId);
        
        return garbageCanId;
    }

    /**
     * @dev Updates the fill level and value of a garbage can
     * @param garbageCanId The ID of the garbage can
     * @param recyclableType The type of recyclable being deposited
     * @param amount The amount being deposited
     * @param value The value of the deposit
     */
    function updateFillLevel(
        uint256 garbageCanId,
        RecyclableType recyclableType,
        uint256 amount,
        uint256 value
    ) external onlyAuthorizedUpdater whenNotPaused {
        GarbageCan storage garbageCan = _garbageCans[garbageCanId];
        
        // Check if the garbage can exists and is active
        if (bytes(garbageCan.location).length == 0) {
            revert GarbageCanNotFound();
        }
        
        if (!garbageCan.isActive) {
            revert GarbageCanNotActive();
        }
        
        if (garbageCan.isLocked) {
            revert GarbageCanLocked();
        }
        
        // Update the fill level and value
        garbageCan.fillLevels[recyclableType] += amount;
        garbageCan.currentValue += value;
        
        emit FillLevelUpdated(garbageCanId, recyclableType, amount, value);
    }

    /**
     * @dev Allows collectors to purchase the contents of a garbage can
     * @param garbageCanId The ID of the garbage can to purchase contents from
     */
    function buyContents(uint256 garbageCanId) external whenNotPaused nonReentrant {
        GarbageCan storage garbageCan = _garbageCans[garbageCanId];
        
        // Check if the garbage can exists and is active
        if (bytes(garbageCan.location).length == 0) {
            revert GarbageCanNotFound();
        }
        
        if (!garbageCan.isActive) {
            revert GarbageCanNotActive();
        }
        
        if (garbageCan.isLocked) {
            revert GarbageCanLocked();
        }
        
        // Get the current value of the garbage can
        uint256 fullValue = garbageCan.currentValue;
        
        // Calculate the purchase amount (percentage of the full value)
        uint256 purchaseAmount = (fullValue * _purchasePercentage) / 10000;
        
        // Store current state before external calls
        uint256 currentPlasticLevel = garbageCan.fillLevels[RecyclableType.PLASTIC];
        uint256 currentMetalLevel = garbageCan.fillLevels[RecyclableType.METAL];
        uint256 currentOtherLevel = garbageCan.fillLevels[RecyclableType.OTHER];
        
        // Lock the garbage can during the transaction
        garbageCan.isLocked = true;
        
        // Transfer USDC from the collector to this contract
        bool success = _usdcToken.transferFrom(msg.sender, address(this), purchaseAmount);
        if (!success) {
            // Unlock the garbage can if the transfer fails
            garbageCan.isLocked = false;
            revert InsufficientPayment();
        }
        
        // Distribute rewards to stake NFT holders (100% of what the collector paid)
        _distributeRewards(garbageCanId, purchaseAmount);
        
        // Reset the fill levels and value
        garbageCan.fillLevels[RecyclableType.PLASTIC] = 0;
        garbageCan.fillLevels[RecyclableType.METAL] = 0;
        garbageCan.fillLevels[RecyclableType.OTHER] = 0;
        garbageCan.currentValue = 0;
        garbageCan.lastEmptiedTimestamp = block.timestamp;
        
        // Unlock the garbage can
        garbageCan.isLocked = false;
        
        emit ContentsPurchased(garbageCanId, msg.sender, purchaseAmount);
        
        // Emit detailed event with the purchased amounts
        emit DetailedContentsPurchased(
            garbageCanId, 
            msg.sender, 
            currentPlasticLevel, 
            currentMetalLevel, 
            currentOtherLevel, 
            purchaseAmount
        );
    }

    /**
     * @dev Returns information about a garbage can
     * @param garbageCanId The ID of the garbage can
     * @return location The physical location of the garbage can
     * @return currentValue The current value of the garbage can's contents
     * @return isActive Whether the garbage can is active
     * @return isLocked Whether the garbage can is locked
     * @return deploymentTimestamp When the garbage can was deployed
     * @return lastEmptiedTimestamp When the garbage can was last emptied
     * @return totalStaked The total amount staked for the garbage can
     */
    function getGarbageCanInfo(uint256 garbageCanId) external view returns (
        string memory location,
        uint256 currentValue,
        bool isActive,
        bool isLocked,
        uint256 deploymentTimestamp,
        uint256 lastEmptiedTimestamp,
        uint256 totalStaked
    ) {
        GarbageCan storage garbageCan = _garbageCans[garbageCanId];
        
        // Check if the garbage can exists
        if (bytes(garbageCan.location).length == 0) {
            revert GarbageCanNotFound();
        }
        
        return (
            garbageCan.location,
            garbageCan.currentValue,
            garbageCan.isActive,
            garbageCan.isLocked,
            garbageCan.deploymentTimestamp,
            garbageCan.lastEmptiedTimestamp,
            garbageCan.totalStaked
        );
    }

    /**
     * @dev Returns the fill level of a garbage can for a specific recyclable type
     * @param garbageCanId The ID of the garbage can
     * @param recyclableType The type of recyclable
     * @return The fill level
     */
    function getFillLevel(uint256 garbageCanId, RecyclableType recyclableType) external view returns (uint256) {
        GarbageCan storage garbageCan = _garbageCans[garbageCanId];
        
        // Check if the garbage can exists
        if (bytes(garbageCan.location).length == 0) {
            revert GarbageCanNotFound();
        }
        
        return garbageCan.fillLevels[recyclableType];
    }

    /**
     * @dev Returns information about a pending garbage can
     * @param pendingGarbageCanId The ID of the pending garbage can
     * @return location The physical location of the garbage can
     * @return targetAmount The target amount of USDC needed to deploy the garbage can
     * @return currentAmount The current amount of USDC staked
     * @return isDeployed Whether the garbage can has been deployed
     */
    function getPendingGarbageCanInfo(uint256 pendingGarbageCanId) external view returns (
        string memory location,
        uint256 targetAmount,
        uint256 currentAmount,
        bool isDeployed
    ) {
        PendingGarbageCan storage pendingGarbageCan = _pendingGarbageCans[pendingGarbageCanId];
        
        // Check if the pending garbage can exists
        if (bytes(pendingGarbageCan.location).length == 0) {
            revert GarbageCanNotFound();
        }
        
        return (
            pendingGarbageCan.location,
            pendingGarbageCan.targetAmount,
            pendingGarbageCan.currentAmount,
            pendingGarbageCan.isDeployed
        );
    }

    /**
     * @dev Returns the stake amount for a specific address in a pending garbage can
     * @param pendingGarbageCanId The ID of the pending garbage can
     * @param staker The address of the staker
     * @return The stake amount
     */
    function getStakeAmount(uint256 pendingGarbageCanId, address staker) external view returns (uint256) {
        PendingGarbageCan storage pendingGarbageCan = _pendingGarbageCans[pendingGarbageCanId];
        
        // Check if the pending garbage can exists
        if (bytes(pendingGarbageCan.location).length == 0) {
            revert GarbageCanNotFound();
        }
        
        return pendingGarbageCan.stakes[staker];
    }

    /**
     * @dev Returns all fill levels for a garbage can
     * @param garbageCanId The ID of the garbage can
     * @return plasticLevel The fill level for plastic
     * @return metalLevel The fill level for metal
     * @return otherLevel The fill level for other materials
     */
    function getGarbageCanFillLevels(uint256 garbageCanId) external view returns (
        uint256 plasticLevel,
        uint256 metalLevel,
        uint256 otherLevel
    ) {
        GarbageCan storage garbageCan = _garbageCans[garbageCanId];
        
        // Check if the garbage can exists
        if (bytes(garbageCan.location).length == 0) {
            revert GarbageCanNotFound();
        }
        
        return (
            garbageCan.fillLevels[RecyclableType.PLASTIC],
            garbageCan.fillLevels[RecyclableType.METAL],
            garbageCan.fillLevels[RecyclableType.OTHER]
        );
    }

    /**
     * @dev Returns all pending garbage cans
     * @return Array of pending garbage can IDs
     */
    function getAllPendingGarbageCans() external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count pending garbage cans
        for (uint256 i = 0; i < _nextPendingGarbageCanId; i++) {
            if (bytes(_pendingGarbageCans[i].location).length > 0 && !_pendingGarbageCans[i].isDeployed) {
                count++;
            }
        }
        
        // Create array of pending garbage can IDs
        uint256[] memory pendingGarbageCans = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _nextPendingGarbageCanId; i++) {
            if (bytes(_pendingGarbageCans[i].location).length > 0 && !_pendingGarbageCans[i].isDeployed) {
                pendingGarbageCans[index] = i;
                index++;
            }
        }
        
        return pendingGarbageCans;
    }

    /**
     * @dev Returns all active garbage cans
     * @return Array of active garbage can IDs
     */
    function getAllActiveGarbageCans() external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count active garbage cans
        for (uint256 i = 0; i < _nextGarbageCanId; i++) {
            if (bytes(_garbageCans[i].location).length > 0 && _garbageCans[i].isActive) {
                count++;
            }
        }
        
        // Create array of active garbage can IDs
        uint256[] memory activeGarbageCans = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _nextGarbageCanId; i++) {
            if (bytes(_garbageCans[i].location).length > 0 && _garbageCans[i].isActive) {
                activeGarbageCans[index] = i;
                index++;
            }
        }
        
        return activeGarbageCans;
    }

    /**
     * @dev Returns all garbage cans with pagination
     * @param offset The offset to start from
     * @param limit The maximum number of garbage cans to return
     * @return Array of garbage can IDs
     */
    function getAllGarbageCans(uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        uint256 totalCount = 0;
        
        // Count all garbage cans
        for (uint256 i = 0; i < _nextGarbageCanId; i++) {
            if (bytes(_garbageCans[i].location).length > 0) {
                totalCount++;
            }
        }
        
        // Adjust limit if it exceeds the total count
        if (offset >= totalCount) {
            return new uint256[](0);
        }
        
        uint256 remaining = totalCount - offset;
        uint256 actualLimit = remaining < limit ? remaining : limit;
        
        // Create array of garbage can IDs
        uint256[] memory garbageCans = new uint256[](actualLimit);
        uint256 index = 0;
        uint256 skipped = 0;
        
        for (uint256 i = 0; i < _nextGarbageCanId && index < actualLimit; i++) {
            if (bytes(_garbageCans[i].location).length > 0) {
                if (skipped < offset) {
                    skipped++;
                } else {
                    garbageCans[index] = i;
                    index++;
                }
            }
        }
        
        return garbageCans;
    }

    /**
     * @dev Returns garbage cans by location
     * @param location The location to search for
     * @return Array of garbage can IDs
     */
    function getGarbageCansByLocation(string memory location) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count garbage cans with matching location
        for (uint256 i = 0; i < _nextGarbageCanId; i++) {
            if (bytes(_garbageCans[i].location).length > 0 && 
                keccak256(bytes(_garbageCans[i].location)) == keccak256(bytes(location))) {
                count++;
            }
        }
        
        // Create array of garbage can IDs
        uint256[] memory garbageCans = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _nextGarbageCanId; i++) {
            if (bytes(_garbageCans[i].location).length > 0 && 
                keccak256(bytes(_garbageCans[i].location)) == keccak256(bytes(location))) {
                garbageCans[index] = i;
                index++;
            }
        }
        
        return garbageCans;
    }

    /**
     * @dev Returns the total number of garbage cans
     * @return The total number of garbage cans
     */
    function getTotalGarbageCans() external view returns (uint256) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < _nextGarbageCanId; i++) {
            if (bytes(_garbageCans[i].location).length > 0) {
                count++;
            }
        }
        
        return count;
    }

    /**
     * @dev Returns the total number of pending garbage cans
     * @return The total number of pending garbage cans
     */
    function getTotalPendingGarbageCans() external view returns (uint256) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < _nextPendingGarbageCanId; i++) {
            if (bytes(_pendingGarbageCans[i].location).length > 0 && !_pendingGarbageCans[i].isDeployed) {
                count++;
            }
        }
        
        return count;
    }

    /**
     * @dev Returns the total number of active garbage cans
     * @return The total number of active garbage cans
     */
    function getTotalActiveGarbageCans() external view returns (uint256) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < _nextGarbageCanId; i++) {
            if (bytes(_garbageCans[i].location).length > 0 && _garbageCans[i].isActive) {
                count++;
            }
        }
        
        return count;
    }
    
    /**
     * @dev Gets the recycled weight for a user
     * @param user The user to get the recycled weight for
     * @return The recycled weight
     */
    function getUserRecycledWeight(address user) external view returns (uint256) {
        return _userRecycledWeight[user];
    }
    
    /**
     * @dev Gets the recycling count for a user
     * @param user The user to get the recycling count for
     * @return The recycling count
     */
    function getUserRecyclingCount(address user) external view returns (uint256) {
        return _userRecyclingCount[user];
    }
    
    /**
     * @dev Gets the staked amount for a user
     * @param user The user to get the staked amount for
     * @return The staked amount
     */
    function getUserStakedAmount(address user) external view returns (uint256) {
        return _userStakedAmount[user];
    }
    
    /**
     * @dev Gets the stake duration for a user
     * @param user The user to get the stake duration for
     * @return The stake duration
     */
    function getUserStakeDuration(address user) external view returns (uint256) {
        return _userStakeDuration[user];
    }

    /**
     * @dev Returns system statistics
     * @return totalGarbageCans The total number of garbage cans
     * @return totalPendingGarbageCans The total number of pending garbage cans
     * @return totalActiveGarbageCans The total number of active garbage cans
     * @return totalStaked The total amount staked across all garbage cans
     * @return totalRecycled The total amount recycled across all garbage cans
     * @return totalValue The total value of all garbage cans
     */
    /**
     * @dev Gets the current purchase percentage
     * @return The purchase percentage in basis points (100% = 10000)
     */
    function getPurchasePercentage() external view returns (uint256) {
        return _purchasePercentage;
    }
    
    /**
     * @dev Sets the purchase percentage
     * @param percentage The new purchase percentage in basis points (100% = 10000)
     */
    function setPurchasePercentage(uint256 percentage) external onlyOwner {
        if (percentage == 0 || percentage > 10000) {
            revert("Invalid percentage");
        }
        _purchasePercentage = percentage;
    }
    
    function getSystemStats() external view returns (
        uint256 totalGarbageCans,
        uint256 totalPendingGarbageCans,
        uint256 totalActiveGarbageCans,
        uint256 totalStaked,
        uint256 totalRecycled,
        uint256 totalValue
    ) {
        totalGarbageCans = 0;
        totalPendingGarbageCans = 0;
        totalActiveGarbageCans = 0;
        totalStaked = 0;
        totalRecycled = 0;
        totalValue = 0;
        
        // Count pending garbage cans
        for (uint256 i = 0; i < _nextPendingGarbageCanId; i++) {
            if (bytes(_pendingGarbageCans[i].location).length > 0) {
                if (!_pendingGarbageCans[i].isDeployed) {
                    totalPendingGarbageCans++;
                }
                totalStaked += _pendingGarbageCans[i].currentAmount;
            }
        }
        
        // Count garbage cans
        for (uint256 i = 0; i < _nextGarbageCanId; i++) {
            if (bytes(_garbageCans[i].location).length > 0) {
                totalGarbageCans++;
                
                if (_garbageCans[i].isActive) {
                    totalActiveGarbageCans++;
                }
                
                totalValue += _garbageCans[i].currentValue;
                
                // Sum up recycled amounts
                totalRecycled += _garbageCans[i].fillLevels[RecyclableType.PLASTIC];
                totalRecycled += _garbageCans[i].fillLevels[RecyclableType.METAL];
                totalRecycled += _garbageCans[i].fillLevels[RecyclableType.OTHER];
            }
        }
        
        return (
            totalGarbageCans,
            totalPendingGarbageCans,
            totalActiveGarbageCans,
            totalStaked,
            totalRecycled,
            totalValue
        );
    }

    /**
     * @dev Distributes rewards to stake NFT holders
     * @param garbageCanId The ID of the garbage can
     * @param value The value to distribute
     */
    function _distributeRewards(uint256 garbageCanId, uint256 value) internal {
        // Get all stake NFTs for the garbage can
        uint256[] memory tokenIds = _stakeNFT.getTokensByGarbageCan(garbageCanId);
        
        // If there are no tokens, return early
        if (tokenIds.length == 0) {
            return;
        }
        
        // Calculate the total rewards to distribute (100% of the value)
        uint256 totalRewards = value;
        
        // Mint TRASH tokens directly to the StakeNFT contract
        _trashToken.mint(address(_stakeNFT), totalRewards);
        
        // Calculate total share percentage
        uint256 totalSharePercentage = 0;
        uint256 validTokenCount = 0;
        
        // First pass: count valid tokens and calculate total share percentage
        for (uint256 i = 0; i < tokenIds.length; i++) {
            IStakeNFT.StakeInfo memory stakeInfo = _stakeNFT.getStakeInfo(tokenIds[i]);
            
            // Include all tokens, not just non-split ones
            totalSharePercentage += stakeInfo.sharePercentage;
            validTokenCount++;
        }
        
        // If there are no valid tokens or total share percentage is 0, return early
        if (validTokenCount == 0 || totalSharePercentage == 0) {
            return;
        }
        
        // Second pass: distribute rewards
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            IStakeNFT.StakeInfo memory stakeInfo = _stakeNFT.getStakeInfo(tokenId);
            
            // Calculate the reward amount based on the share percentage
            uint256 rewardAmount = RewardCalculator.calculateReward(
                stakeInfo.sharePercentage,
                totalSharePercentage,
                totalRewards
            );
            
            // Add rewards to the stake NFT
            _stakeNFT.addRewards(tokenId, rewardAmount);
        }
        
        emit RewardsDistributed(garbageCanId, totalRewards);
    }
}
