// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title CannesGame
 * @dev Simple recycling game for Cannes events
 * No achievements, no tokens - just points and leaderboard
 */
contract CannesGame is Ownable, Pausable {
    
    enum RecyclableType { METAL, PLASTIC }
    
    struct UserStats {
        uint256 totalPoints;
        uint256 metalCount;
        uint256 plasticCount;
        uint256 lastActivity;
    }
    
    struct ActivityItem {
        address user;
        RecyclableType itemType;
        uint256 timestamp;
        string nfcId;
    }
    
    // State variables
    mapping(address => UserStats) public userStats;
    mapping(string => address) public nfcToWallet; // NFC ID to wallet mapping
    address[] public players;
    ActivityItem[] public recentActivity;
    
    // Game configuration
    uint256 public constant METAL_POINTS = 10;
    uint256 public constant PLASTIC_POINTS = 15;
    uint256 public constant MAX_RECENT_ACTIVITIES = 100;
    
    // Event dates (timestamps)
    uint256 public eventStart;
    uint256 public eventEnd;
    bool public eventActive;
    
    // Authorized trash can address
    address public trashCan;
    
    // Events
    event ItemDeposited(address indexed user, RecyclableType itemType, uint256 points, uint256 timestamp, string nfcId);
    event EventConfigured(uint256 startTime, uint256 endTime);
    event TrashCanUpdated(address indexed newTrashCan);
    event NfcMappingUpdated(string nfcId, address wallet);
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    modifier onlyTrashCan() {
        require(msg.sender == trashCan, "Only trash can can call this");
        _;
    }
    
    modifier onlyDuringEvent() {
        require(eventActive && block.timestamp >= eventStart && block.timestamp <= eventEnd, "Event not active");
        _;
    }
    
    /**
     * @dev Configure event dates
     */
    function configureEvent(uint256 _eventStart, uint256 _eventEnd) external onlyOwner {
        require(_eventStart < _eventEnd, "Invalid event times");
        eventStart = _eventStart;
        eventEnd = _eventEnd;
        eventActive = true;
        
        emit EventConfigured(_eventStart, _eventEnd);
    }
    
    /**
     * @dev Set trash can address
     */
    function setTrashCan(address _trashCan) external onlyOwner {
        trashCan = _trashCan;
        emit TrashCanUpdated(_trashCan);
    }
    
    /**
     * @dev Map NFC ID to wallet address
     */
    function mapNfcToWallet(string calldata nfcId, address wallet) external onlyOwner {
        nfcToWallet[nfcId] = wallet;
        emit NfcMappingUpdated(nfcId, wallet);
    }
    
    /**
     * @dev Batch map NFC IDs to wallets
     */
    function batchMapNfcToWallet(string[] calldata nfcIds, address[] calldata wallets) external onlyOwner {
        require(nfcIds.length == wallets.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < nfcIds.length; i++) {
            nfcToWallet[nfcIds[i]] = wallets[i];
            emit NfcMappingUpdated(nfcIds[i], wallets[i]);
        }
    }
    
    /**
     * @dev Record a recycling deposit (called by trash can)
     */
    function recordDeposit(string calldata nfcId, RecyclableType itemType) external onlyTrashCan onlyDuringEvent whenNotPaused {
        address user = address(0);
        
        // Try to resolve NFC ID to wallet
        if (bytes(nfcId).length > 0) {
            user = nfcToWallet[nfcId];
        }
        
        // If no user found, still record the activity but don't award points
        if (user != address(0)) {
            // Calculate points
            uint256 points = (itemType == RecyclableType.METAL) ? METAL_POINTS : PLASTIC_POINTS;
            
            // Update user stats
            if (userStats[user].totalPoints == 0) {
                players.push(user);
            }
            
            userStats[user].totalPoints += points;
            userStats[user].lastActivity = block.timestamp;
            
            if (itemType == RecyclableType.METAL) {
                userStats[user].metalCount++;
            } else {
                userStats[user].plasticCount++;
            }
            
            emit ItemDeposited(user, itemType, points, block.timestamp, nfcId);
        }
        
        // Add to recent activity
        _addRecentActivity(user, itemType, nfcId);
    }
    
    /**
     * @dev Manual deposit recording (admin override)
     */
    function manualRecordDeposit(address user, RecyclableType itemType) external onlyOwner {
        require(user != address(0), "Invalid user address");
        
        // Calculate points
        uint256 points = (itemType == RecyclableType.METAL) ? METAL_POINTS : PLASTIC_POINTS;
        
        // Update user stats
        if (userStats[user].totalPoints == 0) {
            players.push(user);
        }
        
        userStats[user].totalPoints += points;
        userStats[user].lastActivity = block.timestamp;
        
        if (itemType == RecyclableType.METAL) {
            userStats[user].metalCount++;
        } else {
            userStats[user].plasticCount++;
        }
        
        emit ItemDeposited(user, itemType, points, block.timestamp, "manual");
        
        // Add to recent activity
        _addRecentActivity(user, itemType, "manual");
    }
    
    /**
     * @dev Add activity to recent activity list
     */
    function _addRecentActivity(address user, RecyclableType itemType, string memory nfcId) internal {
        ActivityItem memory newActivity = ActivityItem({
            user: user,
            itemType: itemType,
            timestamp: block.timestamp,
            nfcId: nfcId
        });
        
        recentActivity.push(newActivity);
        
        // Keep only the most recent activities
        if (recentActivity.length > MAX_RECENT_ACTIVITIES) {
            // Remove the oldest activity
            for (uint256 i = 0; i < recentActivity.length - 1; i++) {
                recentActivity[i] = recentActivity[i + 1];
            }
            recentActivity.pop();
        }
    }
    
    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }
    
    /**
     * @dev Get leaderboard (top players by points)
     */
    function getLeaderboard(uint256 limit) external view returns (address[] memory, uint256[] memory) {
        uint256 playerCount = players.length;
        if (limit > playerCount) {
            limit = playerCount;
        }
        
        // Create arrays for sorting
        address[] memory sortedPlayers = new address[](playerCount);
        uint256[] memory sortedPoints = new uint256[](playerCount);
        
        for (uint256 i = 0; i < playerCount; i++) {
            sortedPlayers[i] = players[i];
            sortedPoints[i] = userStats[players[i]].totalPoints;
        }
        
        // Simple bubble sort by points (descending)
        for (uint256 i = 0; i < playerCount - 1; i++) {
            for (uint256 j = 0; j < playerCount - i - 1; j++) {
                if (sortedPoints[j] < sortedPoints[j + 1]) {
                    // Swap points
                    uint256 tempPoints = sortedPoints[j];
                    sortedPoints[j] = sortedPoints[j + 1];
                    sortedPoints[j + 1] = tempPoints;
                    
                    // Swap players
                    address tempPlayer = sortedPlayers[j];
                    sortedPlayers[j] = sortedPlayers[j + 1];
                    sortedPlayers[j + 1] = tempPlayer;
                }
            }
        }
        
        // Return top players
        address[] memory topPlayers = new address[](limit);
        uint256[] memory topPoints = new uint256[](limit);
        
        for (uint256 i = 0; i < limit; i++) {
            topPlayers[i] = sortedPlayers[i];
            topPoints[i] = sortedPoints[i];
        }
        
        return (topPlayers, topPoints);
    }
    
    /**
     * @dev Get recent activity
     */
    function getRecentActivity(uint256 limit) external view returns (ActivityItem[] memory) {
        uint256 activityCount = recentActivity.length;
        if (limit > activityCount) {
            limit = activityCount;
        }
        
        ActivityItem[] memory result = new ActivityItem[](limit);
        
        // Return most recent activities (reverse order)
        for (uint256 i = 0; i < limit; i++) {
            result[i] = recentActivity[activityCount - 1 - i];
        }
        
        return result;
    }
    
    /**
     * @dev Get game statistics
     */
    function getGameStats() external view returns (
        uint256 totalPlayers,
        uint256 totalItems,
        uint256 totalMetal,
        uint256 totalPlastic,
        uint256 _eventStart,
        uint256 _eventEnd,
        bool _eventActive
    ) {
        uint256 _totalItems = 0;
        uint256 _totalMetal = 0;
        uint256 _totalPlastic = 0;
        
        for (uint256 i = 0; i < players.length; i++) {
            UserStats memory stats = userStats[players[i]];
            _totalMetal += stats.metalCount;
            _totalPlastic += stats.plasticCount;
        }
        
        _totalItems = _totalMetal + _totalPlastic;
        
        return (
            players.length,
            _totalItems,
            _totalMetal,
            _totalPlastic,
            eventStart,
            eventEnd,
            eventActive
        );
    }
    
    /**
     * @dev Get total number of players
     */
    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }
    
    /**
     * @dev Start event manually
     */
    function startEvent() external onlyOwner {
        eventActive = true;
    }
    
    /**
     * @dev Stop event manually
     */
    function stopEvent() external onlyOwner {
        eventActive = false;
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Reset game data (emergency function)
     */
    function resetGame() external onlyOwner {
        // Clear all player data
        for (uint256 i = 0; i < players.length; i++) {
            delete userStats[players[i]];
        }
        
        // Clear arrays
        delete players;
        delete recentActivity;
        
        eventActive = false;
    }
}
