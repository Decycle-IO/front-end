import { contractAddresses as addresses, networkConfig } from '../../contracts.config';

export const trashTokenABI = [
  // ERC20 Standard Functions
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
  // Custom Functions
  'function mint(address to, uint256 amount) external',
  'function batchMint(address[] calldata recipients, uint256[] calldata amounts) external',
  'function burn(uint256 amount) external',
  'function burnFrom(address from, uint256 amount) external',
  'function burnAsAuthorized(address from, uint256 amount) external',
  'function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external',
  'function authorizeMinter(address minter) external',
  'function unauthorizeMinter(address minter) external',
  'function authorizeBurner(address burner) external',
  'function unauthorizeBurner(address burner) external',
  'function pause() external',
  'function unpause() external',
  'function isAuthorizedMinter(address minter) external view returns (bool)',
  'function isAuthorizedBurner(address burner) external view returns (bool)'
];

export const recyclingSystemABI = [
  // Garbage Can Management
  'function createPendingGarbageCan(string memory location, uint256 targetAmount) external returns (uint256)',
  'function depositStake(uint256 pendingGarbageCanId, uint256 amount) external returns (uint256)',
  'function deployGarbageCan(uint256 pendingGarbageCanId) external returns (uint256)',
  'function updateFillLevel(uint256 garbageCanId, uint8 recyclableType, uint256 amount, uint256 value) external',
  'function buyContents(uint256 garbageCanId) external',
  // View Functions
  'function getGarbageCanInfo(uint256 garbageCanId) external view returns (string memory, uint256, bool, bool, uint256, uint256, uint256)',
  'function getFillLevel(uint256 garbageCanId, uint8 recyclableType) external view returns (uint256)',
  'function getPendingGarbageCanInfo(uint256 pendingGarbageCanId) external view returns (string memory, uint256, uint256, bool)',
  'function getStakeAmount(uint256 pendingGarbageCanId, address staker) external view returns (uint256)',
  'function getGarbageCanFillLevels(uint256 garbageCanId) external view returns (uint256, uint256, uint256)',
  'function getAllPendingGarbageCans() external view returns (uint256[] memory)',
  'function getAllActiveGarbageCans() external view returns (uint256[] memory)',
  'function getAllGarbageCans(uint256 offset, uint256 limit) external view returns (uint256[] memory)',
  'function getGarbageCansByLocation(string memory location) external view returns (uint256[] memory)',
  'function getSystemStats() external view returns (uint256, uint256, uint256, uint256, uint256, uint256)',
  'function getUserRecycledWeight(address user) external view returns (uint256)',
  'function getUserRecyclingCount(address user) external view returns (uint256)',
  'function getUserStakedAmount(address user) external view returns (uint256)',
  'function getUserStakeDuration(address user) external view returns (uint256)'
];

export const stakeNFTABI = [
  // ERC721 Standard Functions
  'function balanceOf(address owner) external view returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function safeTransferFrom(address from, address to, uint256 tokenId) external',
  'function transferFrom(address from, address to, uint256 tokenId) external',
  'function approve(address to, uint256 tokenId) external',
  'function getApproved(uint256 tokenId) external view returns (address)',
  'function setApprovalForAll(address operator, bool approved) external',
  'function isApprovedForAll(address owner, address operator) external view returns (bool)',
  'function tokenURI(uint256 tokenId) external view returns (string memory)',
  // Custom Functions
  'function mintStake(address to, uint256 garbageCanId, uint256 amount, uint256 sharePercentage) external returns (uint256)',
  'function addRewards(uint256 tokenId, uint256 amount) external',
  'function claimRewards(uint256 tokenId) external returns (uint256)',
  'function splitStake(uint256 tokenId, uint256[] calldata amounts) external returns (uint256[] memory)',
  'function mergeStakes(uint256[] calldata tokenIds) external returns (uint256)',
  'function getStakeInfo(uint256 tokenId) external view returns (tuple(uint256 tokenId, uint256 garbageCanId, uint256 stakedAmount, uint256 sharePercentage, uint256 stakingTimestamp, uint256 pendingRewards, address owner))',
  'function getTokensByOwner(address owner) external view returns (uint256[] memory)',
  'function getTokensByGarbageCan(uint256 garbageCanId) external view returns (uint256[] memory)'
];

export const questSystemABI = [
  // Quest Management
  'function createQuest(uint8 questType, string memory name, string memory description, uint256 requiredAmount, uint256 rewardAmount, bool nftReward, string memory nftURI) external returns (uint256)',
  'function recordRecycling(bytes32 emailHash, uint8 materialType, uint256 amount) external',
  'function verifyEmail(bytes32 emailHash, bytes memory proof) external',
  'function claimRewards(uint8 questType, uint256 questId) external',
  // View Functions
  'function getQuestStatus(bytes32 emailHash, uint8 questType, uint256 questId) external view returns (uint256, uint256, bool, bool)',
  'function getQuest(uint256 questId) external view returns (tuple(uint256 id, uint8 type, string name, string description, uint256 requiredAmount, uint256 rewardAmount, bool nftReward, string nftURI, bool isActive, uint256 creationTimestamp))',
  'function getQuestsByType(uint8 questType) external view returns (uint256[] memory)',
  'function getActiveQuests(uint256 offset, uint256 limit) external view returns (uint256[] memory)',
  'function getAllActiveQuests() external view returns (uint256[] memory)',
  'function getVerifiedEmail() external view returns (bytes32)',
  'function isQuestCompleted(address user, uint256 questId) external view returns (bool)'
];

export const achievementNFTABI = [
  // ERC721 Standard Functions
  'function balanceOf(address owner) external view returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function safeTransferFrom(address from, address to, uint256 tokenId) external',
  'function transferFrom(address from, address to, uint256 tokenId) external',
  'function approve(address to, uint256 tokenId) external',
  'function getApproved(uint256 tokenId) external view returns (address)',
  'function setApprovalForAll(address operator, bool approved) external',
  'function isApprovedForAll(address owner, address operator) external view returns (bool)',
  'function tokenURI(uint256 tokenId) external view returns (string memory)',
  // Custom Functions
  'function mintAchievement(address to, uint256 questId, string memory achievementType, string memory metadata, string memory _tokenURI) external returns (uint256)',
  'function getAchievementInfo(uint256 tokenId) external view returns (tuple(uint256 tokenId, uint256 questId, string achievementType, string metadata, uint256 earnedTimestamp, address owner))',
  'function getTokensByOwner(address owner) external view returns (uint256[] memory)',
  'function getTokensByQuest(uint256 questId) external view returns (uint256[] memory)'
];

export const emailVerifierABI = [
  // Email Verification
  'function verifyEmail(tuple(string email, bytes signature, uint256 timestamp) calldata unverifiedEmail, address wallet) external view returns (tuple(bool success, string message, bytes32 emailHash))',
  'function verifyEmail(address user, bytes32 emailHash) external',
  'function isEmailVerified(address user, bytes32 emailHash) external view returns (bool)',
  'function getVerificationTimestamp(address user, bytes32 emailHash) external view returns (uint256)',
  'function revokeEmailVerification(address user, bytes32 emailHash) external',
  'function batchVerifyEmails(address[] calldata users, bytes32[] calldata emailHashes) external',
  'function getVerifiedWallet(bytes32 emailHash) external view returns (address)'
];

export const trashGenesisABI = [
  {
    "type": "function",
    "name": "currentPhase",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint8", "internalType": "uint8"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "whitelist",
    "inputs": [{"name": "user", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ethPriceUSD",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalEthRaised",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalTokensSold",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalContributors",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "trashToken",
    "inputs": [],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "treasury",
    "inputs": [],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "calculateTokenAmount",
    "inputs": [{"name": "ethAmount", "type": "uint256", "internalType": "uint256"}],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserContributions",
    "inputs": [{"name": "_user", "type": "address", "internalType": "address"}],
    "outputs": [
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentPhaseInfo",
    "inputs": [],
    "outputs": [
      {"name": "", "type": "uint8", "internalType": "uint8"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSaleStats",
    "inputs": [],
    "outputs": [
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "contribute",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "pause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unpause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "emergencyWithdraw",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;

export const contractAddresses = addresses;
export const contractABIs = {
  trashToken: trashTokenABI,
  recyclingSystem: recyclingSystemABI,
  stakeNFT: stakeNFTABI,
  questSystem: questSystemABI,
  achievementNFT: achievementNFTABI,
  emailVerifier: emailVerifierABI,
  trashGenesis: trashGenesisABI
};


export { networkConfig };
