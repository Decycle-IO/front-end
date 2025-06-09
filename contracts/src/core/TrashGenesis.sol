// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/ITrashGenesis.sol";

/**
 * @title TrashGenesis
 * @dev Implementation of the TrashGenesis contract for TRASH token sale
 */
contract TrashGenesis is ITrashGenesis, Ownable, Pausable, ReentrancyGuard {
    // State variables
    address public immutable override trashToken;
    address public override treasury;
    uint256 public override ethPriceUSD; // ETH price in USD (scaled by 1e8)
    SalePhase public override currentPhase;
    uint256 public override totalEthRaised;
    uint256 public override totalTokensSold;
    uint256 public override totalContributors;
    
    // Mappings
    mapping(SalePhase => PhaseConfig) public override phaseConfigs;
    mapping(SalePhase => uint256) public override ethRaisedPerPhase;
    mapping(SalePhase => uint256) public override contributorsPerPhase;
    mapping(address => mapping(SalePhase => uint256)) public override contributions;
    mapping(address => bool) public override whitelist;
    address[] public override contributorAddresses;

    // Events
    event PhaseUpdated(SalePhase phase, uint256 tokenPrice, uint256 hardCap, uint256 startTime, uint256 endTime);
    event ContributionReceived(address indexed contributor, uint256 amount, uint256 tokenAmount, SalePhase phase);
    event WhitelistUpdated(address indexed user, bool status);
    event EthPriceUpdated(uint256 newPrice);
    event TreasuryUpdated(address newTreasury);
    event TokensWithdrawn(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed owner, uint256 amount);

    /**
     * @dev Constructor
     * @param _trashToken Address of the TRASH token contract
     * @param _treasury Address of the treasury
     * @param _ethPriceUSD Initial ETH price in USD (scaled by 1e8)
     */
    constructor(
        address _trashToken,
        address _treasury,
        uint256 _ethPriceUSD
    ) Ownable(msg.sender) {
        require(_trashToken != address(0), "TrashGenesis: zero address");
        require(_treasury != address(0), "TrashGenesis: zero address");
        require(_ethPriceUSD > 0, "TrashGenesis: invalid ETH price");

        trashToken = _trashToken;
        treasury = _treasury;
        ethPriceUSD = _ethPriceUSD;
        currentPhase = SalePhase.NotStarted;
    }

    /**
     * @dev Contribute ETH to the sale
     */
    function contribute() external payable override nonReentrant whenNotPaused {
        require(currentPhase != SalePhase.NotStarted && currentPhase != SalePhase.Ended, "TrashGenesis: sale not active");
        require(msg.value > 0, "TrashGenesis: zero contribution");
        
        // Get phase config
        PhaseConfig memory config = phaseConfigs[currentPhase];
        
        // Check if phase is active
        require(block.timestamp >= config.startTime, "TrashGenesis: phase not started");
        require(block.timestamp <= config.endTime, "TrashGenesis: phase ended");
        
        // Check contribution limits
        require(msg.value >= config.minContribution, "TrashGenesis: below min contribution");
        require(msg.value <= config.maxContribution, "TrashGenesis: above max contribution");
        
        // Check if user is whitelisted for whitelist phase
        if (currentPhase == SalePhase.Whitelist) {
            require(whitelist[msg.sender], "TrashGenesis: not whitelisted");
        }
        
        // Check if hard cap is reached
        require(ethRaisedPerPhase[currentPhase] + msg.value <= config.hardCap, "TrashGenesis: hard cap reached");
        
        // Calculate token amount
        uint256 tokenAmount = calculateTokenAmount(msg.value);
        require(tokenAmount > 0, "TrashGenesis: zero tokens");
        
        // Update state
        if (contributions[msg.sender][currentPhase] == 0) {
            contributorsPerPhase[currentPhase]++;
        }
        
        if (contributions[msg.sender][SalePhase.Private] == 0 && 
            contributions[msg.sender][SalePhase.Whitelist] == 0 && 
            contributions[msg.sender][SalePhase.Public] == 0) {
            contributorAddresses.push(msg.sender);
            totalContributors++;
        }
        
        contributions[msg.sender][currentPhase] += msg.value;
        ethRaisedPerPhase[currentPhase] += msg.value;
        totalEthRaised += msg.value;
        totalTokensSold += tokenAmount;
        
        // Transfer ETH to treasury
        (bool success, ) = treasury.call{value: msg.value}("");
        require(success, "TrashGenesis: ETH transfer failed");
        
        emit ContributionReceived(msg.sender, msg.value, tokenAmount, currentPhase);
    }

    /**
     * @dev Calculate token amount based on ETH amount
     * @param ethAmount Amount of ETH
     * @return tokenAmount Amount of tokens
     */
    function calculateTokenAmount(uint256 ethAmount) public view override returns (uint256) {
        if (ethAmount == 0 || ethPriceUSD == 0) return 0;
        
        // Get phase config
        PhaseConfig memory config = phaseConfigs[currentPhase];
        if (config.tokenPrice == 0) return 0;
        
        // Calculate USD value: ethAmount * ethPriceUSD / 1e8
        uint256 usdValue = (ethAmount * ethPriceUSD) / 1e8;
        
        // Calculate token amount: usdValue * 1e6 / tokenPrice
        // tokenPrice is in USD per token (scaled by 1e6)
        return (usdValue * 1e6) / config.tokenPrice;
    }

    /**
     * @dev Get current phase info
     * @return phase Current phase
     * @return tokenPrice Token price in USD (scaled by 1e6)
     * @return hardCap Hard cap in ETH
     * @return raised Amount raised in ETH
     * @return startTime Phase start time
     * @return endTime Phase end time
     * @return minContribution Minimum contribution
     * @return maxContribution Maximum contribution
     */
    function getCurrentPhaseInfo() external view override returns (
        SalePhase phase,
        uint256 tokenPrice,
        uint256 hardCap,
        uint256 raised,
        uint256 startTime,
        uint256 endTime,
        uint256 minContribution,
        uint256 maxContribution
    ) {
        PhaseConfig memory config = phaseConfigs[currentPhase];
        return (
            currentPhase,
            config.tokenPrice,
            config.hardCap,
            ethRaisedPerPhase[currentPhase],
            config.startTime,
            config.endTime,
            config.minContribution,
            config.maxContribution
        );
    }

    /**
     * @dev Get sale stats
     * @return totalRaised Total ETH raised
     * @return totalSold Total tokens sold
     * @return totalUsers Total unique contributors
     */
    function getSaleStats() external view override returns (
        uint256 totalRaised,
        uint256 totalSold,
        uint256 totalUsers
    ) {
        return (totalEthRaised, totalTokensSold, totalContributors);
    }

    /**
     * @dev Get contribution stats for an address
     * @param _user User address
     * @return privateContribution Contribution in private phase
     * @return whitelistContribution Contribution in whitelist phase
     * @return publicContribution Contribution in public phase
     * @return totalContribution Total contribution
     */
    function getUserContributions(address _user) external view override returns (
        uint256 privateContribution,
        uint256 whitelistContribution,
        uint256 publicContribution,
        uint256 totalContribution
    ) {
        privateContribution = contributions[_user][SalePhase.Private];
        whitelistContribution = contributions[_user][SalePhase.Whitelist];
        publicContribution = contributions[_user][SalePhase.Public];
        totalContribution = privateContribution + whitelistContribution + publicContribution;
    }

    /**
     * @dev Set the current sale phase
     * @param _phase The new phase
     * @param _startTime Phase start timestamp
     * @param _endTime Phase end timestamp
     */
    function setPhase(SalePhase _phase, uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(_phase <= SalePhase.Ended, "TrashGenesis: invalid phase");
        require(_startTime < _endTime, "TrashGenesis: invalid time range");
        
        if (_phase != SalePhase.NotStarted && _phase != SalePhase.Ended) {
            require(phaseConfigs[_phase].tokenPrice > 0, "TrashGenesis: phase not configured");
        }
        
        currentPhase = _phase;
        
        if (_phase != SalePhase.NotStarted && _phase != SalePhase.Ended) {
            PhaseConfig storage config = phaseConfigs[_phase];
            config.startTime = _startTime;
            config.endTime = _endTime;
            
            emit PhaseUpdated(_phase, config.tokenPrice, config.hardCap, _startTime, _endTime);
        }
    }

    /**
     * @dev Update phase configuration
     * @param _phase The phase to configure
     * @param _tokenPrice Token price in USD (scaled by 1e6)
     * @param _hardCap Hard cap in ETH
     * @param _minContribution Minimum contribution in ETH
     * @param _maxContribution Maximum contribution in ETH
     */
    function updatePhaseConfig(
        SalePhase _phase,
        uint256 _tokenPrice,
        uint256 _hardCap,
        uint256 _minContribution,
        uint256 _maxContribution
    ) external onlyOwner {
        require(_phase != SalePhase.NotStarted && _phase != SalePhase.Ended, "TrashGenesis: invalid phase");
        require(_tokenPrice > 0, "TrashGenesis: invalid token price");
        require(_hardCap > 0, "TrashGenesis: invalid hard cap");
        require(_minContribution > 0, "TrashGenesis: invalid min contribution");
        require(_maxContribution >= _minContribution, "TrashGenesis: invalid max contribution");
        
        PhaseConfig storage config = phaseConfigs[_phase];
        config.tokenPrice = _tokenPrice;
        config.hardCap = _hardCap;
        config.minContribution = _minContribution;
        config.maxContribution = _maxContribution;
        
        if (currentPhase == _phase) {
            emit PhaseUpdated(_phase, _tokenPrice, _hardCap, config.startTime, config.endTime);
        }
    }

    /**
     * @dev Add addresses to whitelist
     * @param _users Array of addresses to add
     */
    function addToWhitelist(address[] calldata _users) external onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            whitelist[_users[i]] = true;
            emit WhitelistUpdated(_users[i], true);
        }
    }

    /**
     * @dev Remove addresses from whitelist
     * @param _users Array of addresses to remove
     */
    function removeFromWhitelist(address[] calldata _users) external onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            whitelist[_users[i]] = false;
            emit WhitelistUpdated(_users[i], false);
        }
    }

    /**
     * @dev Update ETH price in USD
     * @param _newPrice New ETH price in USD (scaled by 1e8)
     */
    function updateEthPrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "TrashGenesis: invalid ETH price");
        ethPriceUSD = _newPrice;
        emit EthPriceUpdated(_newPrice);
    }

    /**
     * @dev Update treasury address
     * @param _newTreasury New treasury address
     */
    function updateTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "TrashGenesis: zero address");
        treasury = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }

    /**
     * @dev Pause the contract
     */
    function pause() external override onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external override onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdraw function
     */
    function emergencyWithdraw() external override onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "TrashGenesis: no balance");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "TrashGenesis: withdraw failed");
        
        emit EmergencyWithdraw(owner(), balance);
    }
}
