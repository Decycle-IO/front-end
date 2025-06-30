// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GreenGuardians
 * @dev Simple donation contract for Green Guardians system
 * No achievements, no tokens - just donations and recognition
 */
contract GreenGuardians is Ownable, Pausable {
    
    struct GuardianProfile {
        string displayName;
        string imageUrl;
        uint256 donationAmount;
        uint256 donationTime;
    }
    
    // State variables
    mapping(address => GuardianProfile) public guardianProfiles;
    address[] public guardians;
    uint256 public totalDonated;
    
    // Events
    event DonationReceived(address indexed donor, uint256 amount, uint256 totalDonated);
    event GuardianProfileUpdated(address indexed guardian, string displayName, string imageUrl);
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @dev Donate ETH to become a Green Guardian
     */
    function donate() external payable whenNotPaused {
        require(msg.value > 0, "Must donate something");
        
        // If first donation, add to guardians array
        if (guardianProfiles[msg.sender].donationAmount == 0) {
            guardians.push(msg.sender);
        }
        
        // Update donation amount
        guardianProfiles[msg.sender].donationAmount += msg.value;
        guardianProfiles[msg.sender].donationTime = block.timestamp;
        totalDonated += msg.value;
        
        emit DonationReceived(msg.sender, msg.value, totalDonated);
    }
    
    /**
     * @dev Set guardian profile information
     */
    function setGuardianProfile(string calldata displayName, string calldata imageUrl) external {
        require(guardianProfiles[msg.sender].donationAmount > 0, "Must be a donor");
        
        guardianProfiles[msg.sender].displayName = displayName;
        guardianProfiles[msg.sender].imageUrl = imageUrl;
        
        emit GuardianProfileUpdated(msg.sender, displayName, imageUrl);
    }
    
    /**
     * @dev Check if address is a guardian
     */
    function isGuardian(address user) external view returns (bool) {
        return guardianProfiles[user].donationAmount > 0;
    }
    
    /**
     * @dev Get guardian profile
     */
    function getGuardianProfile(address guardian) external view returns (GuardianProfile memory) {
        return guardianProfiles[guardian];
    }
    
    /**
     * @dev Get all guardians (paginated)
     */
    function getGuardians(uint256 offset, uint256 limit) external view returns (address[] memory) {
        require(offset < guardians.length, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > guardians.length) {
            end = guardians.length;
        }
        
        address[] memory result = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = guardians[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get total number of guardians
     */
    function getGuardianCount() external view returns (uint256) {
        return guardians.length;
    }
    
    /**
     * @dev Get top guardians by donation amount
     */
    function getTopGuardians(uint256 limit) external view returns (address[] memory) {
        uint256 length = guardians.length;
        if (limit > length) {
            limit = length;
        }
        
        // Create array of guardians with their donation amounts
        address[] memory sortedGuardians = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            sortedGuardians[i] = guardians[i];
        }
        
        // Simple bubble sort by donation amount (descending)
        for (uint256 i = 0; i < length - 1; i++) {
            for (uint256 j = 0; j < length - i - 1; j++) {
                if (guardianProfiles[sortedGuardians[j]].donationAmount < 
                    guardianProfiles[sortedGuardians[j + 1]].donationAmount) {
                    address temp = sortedGuardians[j];
                    sortedGuardians[j] = sortedGuardians[j + 1];
                    sortedGuardians[j + 1] = temp;
                }
            }
        }
        
        // Return top guardians
        address[] memory result = new address[](limit);
        for (uint256 i = 0; i < limit; i++) {
            result[i] = sortedGuardians[i];
        }
        
        return result;
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Pause contract (owner only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract (owner only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
