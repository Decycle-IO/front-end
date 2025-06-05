// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IStakeNFT.sol";
import "../interfaces/ITrashToken.sol";
import "../libraries/NFTSplitter.sol";

/**
 * @title StakeNFT
 * @dev NFT representing stakes in garbage cans
 */
contract StakeNFT is ERC721, Ownable, Pausable, ReentrancyGuard, IStakeNFT {
    /**
     * @dev Error thrown when the caller is not authorized to mint tokens
     */
    error UnauthorizedMinter();

    /**
     * @dev Error thrown when the token does not exist
     */
    error TokenDoesNotExist();

    /**
     * @dev Error thrown when the caller is not the owner of the token
     */
    error NotTokenOwner();

    /**
     * @dev Error thrown when the token has no rewards to claim
     */
    error NoRewardsToClaim();
    
    /**
     * @dev Error thrown when the amount is zero
     */
    error ZeroAmount();

    /**
     * @dev Counter for token IDs
     */
    uint256 private _nextTokenId;

    /**
     * @dev Mapping of token ID to stake info
     */
    mapping(uint256 => StakeInfo) private _stakeInfos;

    /**
     * @dev Mapping of owner address to token IDs
     */
    mapping(address => uint256[]) private _ownerTokens;

    /**
     * @dev Mapping of token ID to index in owner's token list
     */
    mapping(uint256 => uint256) private _ownedTokensIndex;

    /**
     * @dev Mapping of garbage can ID to token IDs
     */
    mapping(uint256 => uint256[]) private _garbageCanTokens;

    /**
     * @dev Mapping of token ID to index in garbage can's token list
     */
    mapping(uint256 => uint256) private _garbageCanTokensIndex;

    /**
     * @dev Mapping of token ID to token URI
     */
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev Mapping of addresses authorized to mint tokens
     */
    mapping(address => bool) internal _authorizedMinters;

    /**
     * @dev Mapping of address to total claimed rewards
     */
    mapping(address => uint256) private _totalClaimedRewards;

    /**
     * @dev Base URI for token metadata
     */
    string private _baseTokenURI;

    /**
     * @dev Reference to the TrashToken contract
     */
    ITrashToken private _trashToken;

    /**
     * @dev Emitted when a minter is authorized
     */
    event MinterAuthorized(address indexed minter);

    /**
     * @dev Emitted when a minter is unauthorized
     */
    event MinterUnauthorized(address indexed minter);

    /**
     * @dev Constructor
     * @param initialOwner The initial owner of the contract
     * @param trashTokenAddress The TrashToken contract
     */
    constructor(address initialOwner, address trashTokenAddress) ERC721("Stake NFT", "STAKE") Ownable(initialOwner) {
        if (trashTokenAddress == address(0)) {
            revert("Zero address for TrashToken");
        }
        
        _trashToken = ITrashToken(trashTokenAddress);
        _baseTokenURI = "https://metadata.decycle.io/stake/";
        
        // Authorize the owner as a minter
        _authorizedMinters[initialOwner] = true;
    }

    /**
     * @dev Modifier to check if the caller is authorized to mint tokens
     */
    modifier onlyAuthorizedMinter() {
        if (!_authorizedMinters[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedMinter();
        }
        _;
    }

    /**
     * @dev Checks if an address is authorized to mint tokens
     * @param minter The address to check
     * @return Whether the address is authorized to mint tokens
     */
    function isAuthorizedMinter(address minter) external view returns (bool) {
        return _authorizedMinters[minter];
    }

    /**
     * @dev Authorizes an address to mint tokens
     * @param minter The address to authorize
     */
    function authorizeMinter(address minter) external onlyOwner {
        _authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }

    /**
     * @dev Unauthorizes an address to mint tokens
     * @param minter The address to unauthorize
     */
    function unauthorizeMinter(address minter) external onlyOwner {
        _authorizedMinters[minter] = false;
        emit MinterUnauthorized(minter);
    }

    /**
     * @dev Pauses token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

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
    ) external onlyAuthorizedMinter returns (uint256) {
        if (amount == 0) {
            revert ZeroAmount();
        }
        
        uint256 tokenId = _nextTokenId++;
        
        // Create stake info before minting to ensure it's available in _update hook
        _stakeInfos[tokenId] = StakeInfo({
            garbageCanId: garbageCanId,
            stakedAmount: amount,
            sharePercentage: sharePercentage,
            stakingTimestamp: block.timestamp,
            accumulatedRewards: 0,
            parentTokenId: 0,
            isSplit: false
        });
        
        // Mint the token - this will trigger _update which will add the token to the garbage can token list
        _safeMint(to, tokenId);

        // Set token URI
        _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, _toString(tokenId))));

        emit StakeNFTMinted(tokenId, to, garbageCanId, amount);

        return tokenId;
    }

    /**
     * @dev Adds rewards to a stake NFT
     * @param tokenId The ID of the token
     * @param amount The amount of rewards to add
     */
    function addRewards(uint256 tokenId, uint256 amount) external onlyAuthorizedMinter {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist();
        }

        _stakeInfos[tokenId].accumulatedRewards += amount;

        emit RewardsAdded(tokenId, amount);
    }

    /**
     * @dev Claims rewards from a stake NFT
     * @param tokenId The ID of the token
     * @return The amount of rewards claimed
     */
    function claimRewards(uint256 tokenId) external whenNotPaused nonReentrant returns (uint256) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist();
        }

        if (_ownerOf(tokenId) != msg.sender) {
            revert NotTokenOwner();
        }

        uint256 rewards = _stakeInfos[tokenId].accumulatedRewards;
        if (rewards == 0) {
            revert NoRewardsToClaim();
        }

        // Reset accumulated rewards
        _stakeInfos[tokenId].accumulatedRewards = 0;

        // Update total claimed rewards for the user
        _totalClaimedRewards[msg.sender] += rewards;

        // Transfer TRASH tokens to the user
        _trashToken.transfer(msg.sender, rewards);

        emit RewardsClaimed(tokenId, msg.sender, rewards);

        return rewards;
    }

    /**
     * @dev Splits a stake NFT into multiple smaller NFTs
     * @param tokenId The ID of the token to split
     * @param amounts Array of amounts for each new NFT
     * @return Array of new token IDs
     */
    function splitStake(
        uint256 tokenId,
        uint256[] calldata amounts
    ) external whenNotPaused nonReentrant returns (uint256[] memory) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist();
        }

        if (_ownerOf(tokenId) != msg.sender) {
            revert NotTokenOwner();
        }

        StakeInfo memory originalStake = _stakeInfos[tokenId];

        // Validate split amounts
        NFTSplitter.validateSplitAmounts(originalStake.stakedAmount, amounts);

        // Calculate share percentages for each new NFT
        uint256[] memory shares = NFTSplitter.calculateSplitShares(
            originalStake.sharePercentage,
            originalStake.stakedAmount,
            amounts
        );

        // Calculate rewards for each new NFT
        uint256[] memory rewards = NFTSplitter.calculateSplitRewards(
            originalStake.accumulatedRewards,
            originalStake.stakedAmount,
            amounts
        );

        // Mint new NFTs
        uint256[] memory newTokenIds = new uint256[](amounts.length);
        for (uint256 i = 0; i < amounts.length; i++) {
            uint256 newTokenId = _nextTokenId++;
            _safeMint(msg.sender, newTokenId);

            // Create stake info for the new NFT
            _stakeInfos[newTokenId] = StakeInfo({
                garbageCanId: originalStake.garbageCanId,
                stakedAmount: amounts[i],
                sharePercentage: shares[i],
                stakingTimestamp: originalStake.stakingTimestamp,
                accumulatedRewards: rewards[i],
                parentTokenId: tokenId,
                isSplit: true
            });

            // Set token URI
            _setTokenURI(newTokenId, string(abi.encodePacked(_baseTokenURI, _toString(newTokenId))));

            newTokenIds[i] = newTokenId;
        }

        // Burn the original token after creating the new ones
        _burn(tokenId);
        _afterBurn(tokenId);

        emit StakeSplit(tokenId, newTokenIds);

        return newTokenIds;
    }

    /**
     * @dev Merges multiple stake NFTs into a single NFT
     * @param tokenIds Array of token IDs to merge
     * @return The ID of the newly minted token
     */
    function mergeStakes(
        uint256[] calldata tokenIds
    ) external whenNotPaused nonReentrant returns (uint256) {
        // Require at least 2 tokens to merge
        if (tokenIds.length < 2) {
            revert("At least 2 tokens required");
        }
        
        // Check that all tokens exist and are owned by the caller
        StakeInfo[] memory stakeInfos = new StakeInfo[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (!_exists(tokenIds[i])) {
                revert TokenDoesNotExist();
            }

            if (_ownerOf(tokenIds[i]) != msg.sender) {
                revert NotTokenOwner();
            }

            stakeInfos[i] = _stakeInfos[tokenIds[i]];
        }

        // Validate merge NFTs
        NFTSplitter.validateMergeNFTs(stakeInfos);

        // Calculate merged values with safe math
        uint256 mergedAmount = 0;
        uint256 mergedShare = 0;
        uint256 mergedRewards = 0;
        
        // Safely calculate merged values
        for (uint256 i = 0; i < stakeInfos.length; i++) {
            // Safe addition for amount
            uint256 newAmount = mergedAmount;
            unchecked {
                newAmount += stakeInfos[i].stakedAmount;
                // Check for overflow
                if (newAmount < mergedAmount) {
                    newAmount = type(uint256).max;
                }
            }
            mergedAmount = newAmount;
            
            // Safe addition for share
            uint256 newShare = mergedShare;
            unchecked {
                newShare += stakeInfos[i].sharePercentage;
                // Check for overflow
                if (newShare < mergedShare) {
                    newShare = type(uint256).max;
                }
            }
            mergedShare = newShare;
            
            // Safe addition for rewards
            uint256 newRewards = mergedRewards;
            unchecked {
                newRewards += stakeInfos[i].accumulatedRewards;
                // Check for overflow
                if (newRewards < mergedRewards) {
                    newRewards = type(uint256).max;
                }
            }
            mergedRewards = newRewards;
        }
        
        uint256 earliestTimestamp = NFTSplitter.getEarliestStakingTimestamp(stakeInfos);
        uint256 garbageCanId = stakeInfos[0].garbageCanId;

        // Create new token ID
        uint256 newTokenId = _nextTokenId++;
        
        // Create stake info for the new NFT before minting
        _stakeInfos[newTokenId] = StakeInfo({
            garbageCanId: garbageCanId,
            stakedAmount: mergedAmount,
            sharePercentage: mergedShare,
            stakingTimestamp: earliestTimestamp,
            accumulatedRewards: mergedRewards,
            parentTokenId: 0,
            isSplit: false
        });


        // Mint new NFT
        _safeMint(msg.sender, newTokenId);

        // Set token URI
        _setTokenURI(newTokenId, string(abi.encodePacked(_baseTokenURI, _toString(newTokenId))));

        // Burn the original tokens after creating the new one
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _burn(tokenIds[i]);
            _afterBurn(tokenIds[i]);
        }

        emit StakesMerged(tokenIds, newTokenId);

        return newTokenId;
    }

    /**
     * @dev Returns information about a stake
     * @param tokenId The ID of the token
     * @return The stake information
     */
    function getStakeInfo(uint256 tokenId) external view returns (StakeInfo memory) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist();
        }

        return _stakeInfos[tokenId];
    }

    /**
     * @dev Returns all token IDs owned by an address
     * @param owner The address to query
     * @return Array of token IDs
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        return _ownerTokens[owner];
    }

    /**
     * @dev Returns all token IDs for a garbage can
     * @param garbageCanId The ID of the garbage can
     * @return Array of token IDs
     */
    function getTokensByGarbageCan(uint256 garbageCanId) external view returns (uint256[] memory) {
        return _garbageCanTokens[garbageCanId];
    }

    /**
     * @dev Checks if a token exists
     * @param tokenId The ID of the token
     * @return True if the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Hook that is called during token transfer
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override whenNotPaused returns (address) {
        address from = _ownerOf(tokenId);
        address previousOwner = super._update(to, tokenId, auth);
        
        // Update owner token tracking
        if (previousOwner != to) {
            if (previousOwner != address(0)) {
                // Remove from previous owner
                uint256 lastTokenIndex = _ownerTokens[previousOwner].length - 1;
                uint256 tokenIndex = _ownedTokensIndex[tokenId];
                
                if (tokenIndex != lastTokenIndex) {
                    uint256 lastTokenId = _ownerTokens[previousOwner][lastTokenIndex];
                    _ownerTokens[previousOwner][tokenIndex] = lastTokenId;
                    _ownedTokensIndex[lastTokenId] = tokenIndex;
                }
                
                _ownerTokens[previousOwner].pop();
            }
            
            if (to != address(0)) {
                // Add to new owner
                _ownedTokensIndex[tokenId] = _ownerTokens[to].length;
                _ownerTokens[to].push(tokenId);
            }
        }
        
    // Update garbage can token tracking
    if (from == address(0) && to != address(0)) {
        // This is a mint
        uint256 garbageCanId = _stakeInfos[tokenId].garbageCanId;
        _garbageCanTokensIndex[tokenId] = _garbageCanTokens[garbageCanId].length;
        _garbageCanTokens[garbageCanId].push(tokenId);
    } else if (from != address(0) && to == address(0)) {
        // This is a burn
        uint256 garbageCanId = _stakeInfos[tokenId].garbageCanId;
        
        // Check if the token exists in the garbage can tokens list
        if (_garbageCanTokens[garbageCanId].length > 0) {
            // Safe check to prevent underflow
            uint256 lastTokenIndex = _garbageCanTokens[garbageCanId].length - 1;
            
            // Only proceed if the token is in the mapping
            if (_garbageCanTokensIndex[tokenId] <= lastTokenIndex) {
                uint256 tokenIndex = _garbageCanTokensIndex[tokenId];
                
                if (tokenIndex != lastTokenIndex) {
                    uint256 lastTokenId = _garbageCanTokens[garbageCanId][lastTokenIndex];
                    _garbageCanTokens[garbageCanId][tokenIndex] = lastTokenId;
                    _garbageCanTokensIndex[lastTokenId] = tokenIndex;
                }
                
                _garbageCanTokens[garbageCanId].pop();
            }
        }
        
        // Clean up the mapping entry for this token
        delete _garbageCanTokensIndex[tokenId];
    }
        
        return previousOwner;
    }

    /**
     * @dev Returns the base URI for token metadata
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Sets the base URI for token metadata
     * @param baseURI The new base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Sets the token URI
     */
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist();
        }
        _tokenURIs[tokenId] = uri;
    }

    /**
     * @dev Returns the URI for a token
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, IStakeNFT) returns (string memory) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist();
        }
        
        string memory baseURI = _baseURI();
        string memory tokenURIValue = _tokenURIs[tokenId];
        
        if (bytes(tokenURIValue).length > 0) {
            return tokenURIValue;
        }
        
        return string(abi.encodePacked(baseURI, _toString(tokenId)));
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

    /**
     * @dev Performs additional cleanup when a token is burned
     */
    function _afterBurn(uint256 tokenId) internal {
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
    
    /**
     * @dev Burns a token and performs additional cleanup
     */
    function burnToken(uint256 tokenId) public virtual {
        // Check if caller is authorized
        address owner = ownerOf(tokenId);
        if (owner != _msgSender() && !isApprovedForAll(owner, _msgSender()) && getApproved(tokenId) != _msgSender()) {
            revert NotTokenOwner();
        }
        
        // Burn the token
        _burn(tokenId);
        
        // Perform additional cleanup
        _afterBurn(tokenId);
    }

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
    ) external view returns (uint256[] memory) {
        uint256[] memory allTokens = _garbageCanTokens[garbageCanId];
        
        if (offset >= allTokens.length) {
            return new uint256[](0);
        }
        
        uint256 remaining = allTokens.length - offset;
        uint256 actualLimit = remaining < limit ? remaining : limit;
        
        uint256[] memory result = new uint256[](actualLimit);
        
        for (uint256 i = 0; i < actualLimit; i++) {
            result[i] = allTokens[offset + i];
        }
        
        return result;
    }

    /**
     * @dev Returns the total number of stakes
     * @return The total number of stakes
     */
    function getTotalStakes() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Returns statistics about a user's stakes
     * @param user The address of the user
     * @return The user's stake statistics
     */
    function getUserStakeStats(address user) external view returns (UserStakeStats memory) {
        uint256[] memory tokenIds = _ownerTokens[user];
        
        UserStakeStats memory stats;
        stats.stakeCount = tokenIds.length;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            StakeInfo memory stakeInfo = _stakeInfos[tokenIds[i]];
            stats.totalStaked += stakeInfo.stakedAmount;
            stats.totalRewards += stakeInfo.accumulatedRewards;
        }
        
        // Include total claimed rewards
        stats.totalClaimed = _totalClaimedRewards[user];
        
        return stats;
    }

    /**
     * @dev Returns statistics about a garbage can's stakes
     * @param garbageCanId The ID of the garbage can
     * @return The garbage can's stake statistics
     */
    function getGarbageCanStakeStats(uint256 garbageCanId) external view returns (GarbageCanStakeStats memory) {
        uint256[] memory tokenIds = _garbageCanTokens[garbageCanId];
        
        GarbageCanStakeStats memory stats;
        stats.stakeCount = tokenIds.length;
        
        // Use a memory array to track unique stakers
        address[] memory stakers = new address[](tokenIds.length);
        uint256 stakerCount = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            StakeInfo memory stakeInfo = _stakeInfos[tokenId];
            stats.totalStaked += stakeInfo.stakedAmount;
            stats.totalRewards += stakeInfo.accumulatedRewards;
            
            address owner = _ownerOf(tokenId);
            
            // Check if this owner is already counted
            bool isNewStaker = true;
            for (uint256 j = 0; j < stakerCount; j++) {
                if (stakers[j] == owner) {
                    isNewStaker = false;
                    break;
                }
            }
            
            if (isNewStaker) {
                stakers[stakerCount] = owner;
                stakerCount++;
                stats.stakerCount++;
            }
        }
        
        return stats;
    }

    /**
     * @dev Returns the total supply of tokens
     * @return The total supply
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Override ERC721 functions that are also in IStakeNFT
     */
    function balanceOf(address owner) public view override(ERC721, IStakeNFT) returns (uint256) {
        return super.balanceOf(owner);
    }
    
    function ownerOf(uint256 tokenId) public view override(ERC721, IStakeNFT) returns (address) {
        return super.ownerOf(tokenId);
    }
    
    function name() public view override(ERC721, IStakeNFT) returns (string memory) {
        return super.name();
    }
    
    function symbol() public view override(ERC721, IStakeNFT) returns (string memory) {
        return super.symbol();
    }

    /**
     * @dev Returns whether the contract supports an interface
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return interfaceId == type(IStakeNFT).interfaceId || super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Returns the TrashToken contract
     * @return The TrashToken contract
     */
    function trashToken() external view returns (address) {
        return address(_trashToken);
    }
    
}
