// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IAchievementNFT.sol";

/**
 * @title AchievementNFT
 * @dev NFT representing achievements in the recycling system
 */
contract AchievementNFT is ERC721, Ownable, Pausable, ReentrancyGuard, IAchievementNFT {
    /**
     * @dev Error thrown when the caller is not authorized to mint tokens
     */
    error UnauthorizedMinter();

    /**
     * @dev Error thrown when the token does not exist
     */
    error TokenDoesNotExist();

    /**
     * @dev Counter for token IDs
     */
    uint256 private _nextTokenId;

    /**
     * @dev Mapping of token ID to achievement info
     */
    mapping(uint256 => AchievementInfo) private _achievementInfos;

    /**
     * @dev Mapping of owner address to token IDs
     */
    mapping(address => uint256[]) private _ownerTokens;

    /**
     * @dev Mapping of token ID to index in owner's token list
     */
    mapping(uint256 => uint256) private _ownedTokensIndex;

    /**
     * @dev Mapping of quest ID to token IDs
     */
    mapping(uint256 => uint256[]) private _questTokens;

    /**
     * @dev Mapping of token ID to token URI
     */
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev Mapping of addresses authorized to mint tokens
     */
    mapping(address => bool) internal _authorizedMinters;

    /**
     * @dev Base URI for token metadata
     */
    string private _baseTokenURI;

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
     */
    constructor(address initialOwner) ERC721("Achievement NFT", "ACHIEVE") Ownable(initialOwner) {
        if (initialOwner == address(0)) {
            revert("Zero address for owner");
        }
        
        // Authorize the owner as a minter
        _authorizedMinters[initialOwner] = true;
        _baseTokenURI = "https://metadata.decycle.io/achievement/";
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
     * @dev Revokes minter authorization (alias for unauthorizeMinter)
     * @param minter The address to revoke
     */
    function revokeMinter(address minter) external onlyOwner {
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
     * @dev Mints a new achievement NFT
     * @param to The address to mint the NFT to
     * @param questId The ID of the quest that was completed
     * @param achievementType The type of achievement
     * @param metadata Additional metadata about the achievement
     * @param _tokenURI The URI for the token metadata
     * @return The ID of the newly minted token
     */
    function mintAchievement(
        address to,
        uint256 questId,
        string memory achievementType,
        string memory metadata,
        string memory _tokenURI
    ) external onlyAuthorizedMinter nonReentrant returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        // Create achievement info
        _achievementInfos[tokenId] = AchievementInfo({
            questId: questId,
            completionTime: block.timestamp,
            achievementType: achievementType,
            metadata: metadata
        });

        // Set token URI
        _setTokenURI(tokenId, _tokenURI);

        // Add token to quest tokens
        _questTokens[questId].push(tokenId);

        emit AchievementNFTMinted(tokenId, to, questId);

        return tokenId;
    }
    
    /**
     * @dev Mints a new token with a specific ID (for testing)
     * @param to The address to mint the token to
     * @param tokenId The ID of the token to mint
     */
    function mint(address to, uint256 tokenId) external onlyAuthorizedMinter whenNotPaused {
        if (tokenId == 0) {
            revert("Token ID cannot be zero");
        }
        _safeMint(to, tokenId);
        
        // Create a basic achievement info
        _achievementInfos[tokenId] = AchievementInfo({
            questId: 0,
            completionTime: block.timestamp,
            achievementType: "Test",
            metadata: "Test achievement"
        });
        
        // Set token URI - don't include base URI here, it will be added in tokenURI()
        _setTokenURI(tokenId, _toString(tokenId));
        
        // Add token to quest tokens
        _questTokens[0].push(tokenId);
        
        emit AchievementNFTMinted(tokenId, to, 0);
    }
    
    /**
     * @dev Batch mints multiple tokens with specific IDs
     * @param recipients Array of addresses to mint tokens to
     * @param tokenIds Array of token IDs to mint
     */
    function batchMint(address[] calldata recipients, uint256[] calldata tokenIds) external onlyAuthorizedMinter whenNotPaused {
        if (recipients.length != tokenIds.length) {
            revert("Array lengths must match");
        }
        
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) {
                revert("Cannot mint to zero address");
            }
            
            if (_exists(tokenIds[i])) {
                revert("Token already exists");
            }
            
            if (tokenIds[i] == 0) {
                revert("Token ID cannot be zero");
            }
            
            _safeMint(recipients[i], tokenIds[i]);
            
            // Create a basic achievement info
            _achievementInfos[tokenIds[i]] = AchievementInfo({
                questId: 0,
                completionTime: block.timestamp,
                achievementType: "Test",
                metadata: "Test achievement"
            });
            
            // Set token URI - don't include base URI here, it will be added in tokenURI()
            _setTokenURI(tokenIds[i], _toString(tokenIds[i]));
            
            // Add token to quest tokens
            _questTokens[0].push(tokenIds[i]);
            
            emit AchievementNFTMinted(tokenIds[i], recipients[i], 0);
        }
    }

    /**
     * @dev Returns information about an achievement
     * @param tokenId The ID of the token
     * @return The achievement information
     */
    function getAchievementInfo(uint256 tokenId) external view returns (AchievementInfo memory) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist();
        }

        return _achievementInfos[tokenId];
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
     * @dev Returns the quest ID associated with a token
     * @param tokenId The ID of the token
     * @return The ID of the quest
     */
    function getQuestId(uint256 tokenId) external view returns (uint256) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist();
        }

        return _achievementInfos[tokenId].questId;
    }

    /**
     * @dev Returns all token IDs for a quest
     * @param questId The ID of the quest
     * @return Array of token IDs
     */
    function getTokensByQuest(uint256 questId) external view returns (uint256[] memory) {
        return _questTokens[questId];
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
     * @dev Sets the metadata for a specific token
     * @param tokenId The ID of the token
     * @param metadata The metadata to set
     */
    function setTokenMetadata(uint256 tokenId, string memory metadata) external onlyOwner {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist();
        }
        
        if (bytes(metadata).length == 0) {
            // If metadata is empty, reset to default
            delete _tokenURIs[tokenId];
        } else {
            _tokenURIs[tokenId] = metadata;
        }
    }
    
    /**
     * @dev Sets the metadata for multiple tokens in a batch
     * @param tokenIds Array of token IDs
     * @param metadataURIs Array of metadata URIs
     */
    function batchSetTokenMetadata(uint256[] calldata tokenIds, string[] calldata metadataURIs) external onlyOwner {
        if (tokenIds.length != metadataURIs.length) {
            revert("Array lengths must match");
        }
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (!_exists(tokenIds[i])) {
                revert TokenDoesNotExist();
            }
            
            if (bytes(metadataURIs[i]).length == 0) {
                // If metadata is empty, reset to default
                delete _tokenURIs[tokenIds[i]];
            } else {
                _tokenURIs[tokenIds[i]] = metadataURIs[i];
            }
        }
    }

    /**
     * @dev Returns the URI for a token
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, IAchievementNFT) returns (string memory) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist();
        }
        
        string memory baseURI = _baseURI();
        string memory tokenURIValue = _tokenURIs[tokenId];
        
        if (bytes(tokenURIValue).length > 0) {
            return string(abi.encodePacked(baseURI, tokenURIValue));
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
            revert("Not authorized to burn");
        }
        
        // Burn the token
        _burn(tokenId);
        
        // Perform additional cleanup
        _afterBurn(tokenId);
    }
    
    /**
     * @dev Returns the total supply of tokens
     * @return The total supply
     */
    function totalSupply() external view returns (uint256) {
        // Count the number of tokens that have been minted
        uint256 count = 0;
        for (uint256 i = 1; i <= 10000; i++) { // Assuming a reasonable upper limit
            if (_exists(i)) {
                count++;
            }
        }
        return count;
    }
    
    /**
     * @dev Returns a token ID at a given index of all the tokens stored by the contract
     * @param index The index to query
     * @return The token ID at the given index
     */
    function tokenByIndex(uint256 index) external view returns (uint256) {
        uint256 count = 0;
        
        for (uint256 i = 1; i <= 10000; i++) { // Assuming a reasonable upper limit
            if (_exists(i)) {
                if (count == index) {
                    return i;
                }
                count++;
            }
        }
        
        revert("Index out of bounds");
    }
    
    /**
     * @dev Returns a token ID owned by `owner` at a given index of its token list
     * @param owner The address to query
     * @param index The index to query
     * @return The token ID at the given index
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256) {
        if (index >= _ownerTokens[owner].length) {
            revert("Index out of bounds");
        }
        return _ownerTokens[owner][index];
    }

    /**
     * @dev Returns whether the contract supports an interface
     */
    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        // ERC721Enumerable interface ID: 0x780e9d63
        return 
            interfaceId == type(IAchievementNFT).interfaceId || 
            interfaceId == 0x780e9d63 || // ERC721Enumerable
            super.supportsInterface(interfaceId);
    }
}
