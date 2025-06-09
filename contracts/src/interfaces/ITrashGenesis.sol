// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title ITrashGenesis
 * @dev Interface for the TrashGenesis contract
 */
interface ITrashGenesis {
    // Enums
    enum SalePhase { NotStarted, Private, Whitelist, Public, Ended }
    
    // Structs
    struct PhaseConfig {
        uint256 tokenPrice;      // Token price in USD (scaled by 1e6)
        uint256 hardCap;         // Hard cap in ETH
        uint256 minContribution; // Minimum contribution in ETH
        uint256 maxContribution; // Maximum contribution in ETH
        uint256 startTime;       // Phase start timestamp
        uint256 endTime;         // Phase end timestamp
    }
    
    // View functions
    function currentPhase() external view returns (SalePhase);
    function phaseConfigs(SalePhase phase) external view returns (uint256 tokenPrice, uint256 hardCap, uint256 minContribution, uint256 maxContribution, uint256 startTime, uint256 endTime);
    function whitelist(address user) external view returns (bool);
    function ethPriceUSD() external view returns (uint256);
    function ethRaisedPerPhase(SalePhase phase) external view returns (uint256);
    function totalEthRaised() external view returns (uint256);
    function totalTokensSold() external view returns (uint256);
    function contributions(address user, SalePhase phase) external view returns (uint256);
    function totalContributors() external view returns (uint256);
    function contributorsPerPhase(SalePhase phase) external view returns (uint256);
    function contributorAddresses(uint256 index) external view returns (address);
    function trashToken() external view returns (address);
    function treasury() external view returns (address);
    function calculateTokenAmount(uint256 ethAmount) external view returns (uint256);
    function getUserContributions(address _user) external view returns (uint256 privateContribution, uint256 whitelistContribution, uint256 publicContribution, uint256 totalContribution);
    function getCurrentPhaseInfo() external view returns (SalePhase phase, uint256 tokenPrice, uint256 hardCap, uint256 raised, uint256 startTime, uint256 endTime, uint256 minContribution, uint256 maxContribution);
    function getSaleStats() external view returns (uint256 totalRaised, uint256 totalSold, uint256 totalUsers);
    
    // Write functions
    function contribute() external payable;
    
    // Admin functions
    function pause() external;
    function unpause() external;
    function emergencyWithdraw() external;
}
