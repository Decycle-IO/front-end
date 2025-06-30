// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GreenGuardians.sol";
import "./CannesGame.sol";

/**
 * @title CannesViews
 * @dev Aggregates data from GreenGuardians and CannesGame for frontend consumption
 */
contract CannesViews {
    
    GreenGuardians public immutable greenGuardians;
    CannesGame public immutable cannesGame;
    
    struct LeaderboardEntry {
        address user;
        uint256 points;
        uint256 rank;
    }
    
    struct GuardianInfo {
        address guardian;
        string displayName;
        string imageUrl;
        uint256 donationAmount;
        uint256 donationTime;
    }
    
    struct GameOverview {
        uint256 totalPlayers;
        uint256 totalItems;
        uint256 totalMetal;
        uint256 totalPlastic;
        uint256 totalGuardians;
        uint256 totalDonated;
        uint256 eventStart;
        uint256 eventEnd;
        bool eventActive;
    }
    
    constructor(address _greenGuardians, address _cannesGame) {
        greenGuardians = GreenGuardians(_greenGuardians);
        cannesGame = CannesGame(_cannesGame);
    }
    
    /**
     * @dev Get complete game overview
     */
    function getGameOverview() external view returns (GameOverview memory) {
        (
            uint256 totalPlayers,
            uint256 totalItems,
            uint256 totalMetal,
            uint256 totalPlastic,
            uint256 eventStart,
            uint256 eventEnd,
            bool eventActive
        ) = cannesGame.getGameStats();
        
        uint256 totalGuardians = greenGuardians.getGuardianCount();
        uint256 totalDonated = greenGuardians.totalDonated();
        
        return GameOverview({
            totalPlayers: totalPlayers,
            totalItems: totalItems,
            totalMetal: totalMetal,
            totalPlastic: totalPlastic,
            totalGuardians: totalGuardians,
            totalDonated: totalDonated,
            eventStart: eventStart,
            eventEnd: eventEnd,
            eventActive: eventActive
        });
    }
    
    /**
     * @dev Get leaderboard with formatted data
     */
    function getLeaderboard(uint256 limit) external view returns (LeaderboardEntry[] memory) {
        (address[] memory players, uint256[] memory points) = cannesGame.getLeaderboard(limit);
        
        LeaderboardEntry[] memory leaderboard = new LeaderboardEntry[](players.length);
        
        for (uint256 i = 0; i < players.length; i++) {
            leaderboard[i] = LeaderboardEntry({
                user: players[i],
                points: points[i],
                rank: i + 1
            });
        }
        
        return leaderboard;
    }
    
    /**
     * @dev Get top guardians with their info
     */
    function getTopGuardians(uint256 limit) external view returns (GuardianInfo[] memory) {
        address[] memory topGuardianAddresses = greenGuardians.getTopGuardians(limit);
        GuardianInfo[] memory guardianInfos = new GuardianInfo[](topGuardianAddresses.length);
        
        for (uint256 i = 0; i < topGuardianAddresses.length; i++) {
            GreenGuardians.GuardianProfile memory profile = greenGuardians.getGuardianProfile(topGuardianAddresses[i]);
            
            guardianInfos[i] = GuardianInfo({
                guardian: topGuardianAddresses[i],
                displayName: profile.displayName,
                imageUrl: profile.imageUrl,
                donationAmount: profile.donationAmount,
                donationTime: profile.donationTime
            });
        }
        
        return guardianInfos;
    }
    
    /**
     * @dev Get user's complete profile (game stats + guardian info)
     */
    function getUserProfile(address user) external view returns (
        CannesGame.UserStats memory gameStats,
        GreenGuardians.GuardianProfile memory guardianProfile,
        bool isGuardian
    ) {
        gameStats = cannesGame.getUserStats(user);
        guardianProfile = greenGuardians.getGuardianProfile(user);
        isGuardian = greenGuardians.isGuardian(user);
        
        return (gameStats, guardianProfile, isGuardian);
    }
    
    /**
     * @dev Get recent activity from the game
     */
    function getRecentActivity(uint256 limit) external view returns (CannesGame.ActivityItem[] memory) {
        return cannesGame.getRecentActivity(limit);
    }
    
    /**
     * @dev Get user's rank in the leaderboard
     */
    function getUserRank(address user) external view returns (uint256) {
        (address[] memory players, uint256[] memory points) = cannesGame.getLeaderboard(cannesGame.getPlayerCount());
        
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == user) {
                return i + 1;
            }
        }
        
        return 0; // User not found in leaderboard
    }
    
    /**
     * @dev Check if user is participating in both systems
     */
    function getUserParticipation(address user) external view returns (
        bool isPlayer,
        bool isGuardian,
        uint256 gamePoints,
        uint256 donationAmount
    ) {
        CannesGame.UserStats memory stats = cannesGame.getUserStats(user);
        isPlayer = stats.totalPoints > 0;
        gamePoints = stats.totalPoints;
        
        isGuardian = greenGuardians.isGuardian(user);
        if (isGuardian) {
            GreenGuardians.GuardianProfile memory profile = greenGuardians.getGuardianProfile(user);
            donationAmount = profile.donationAmount;
        }
        
        return (isPlayer, isGuardian, gamePoints, donationAmount);
    }
    
    /**
     * @dev Get combined statistics for dashboard
     */
    function getDashboardStats() external view returns (
        uint256 totalParticipants, // Unique users across both systems
        uint256 totalValue, // Total donations in ETH
        uint256 totalRecycled, // Total items recycled
        uint256 averagePointsPerPlayer,
        uint256 averageDonationPerGuardian
    ) {
        GameOverview memory overview = this.getGameOverview();
        
        totalParticipants = overview.totalPlayers; // Could be enhanced to count unique users
        totalValue = overview.totalDonated;
        totalRecycled = overview.totalItems;
        
        if (overview.totalPlayers > 0) {
            // Get total points from all players
            uint256 totalPoints = 0;
            (address[] memory players, uint256[] memory points) = cannesGame.getLeaderboard(overview.totalPlayers);
            for (uint256 i = 0; i < points.length; i++) {
                totalPoints += points[i];
            }
            averagePointsPerPlayer = totalPoints / overview.totalPlayers;
        }
        
        if (overview.totalGuardians > 0) {
            averageDonationPerGuardian = overview.totalDonated / overview.totalGuardians;
        }
        
        return (totalParticipants, totalValue, totalRecycled, averagePointsPerPlayer, averageDonationPerGuardian);
    }
}
