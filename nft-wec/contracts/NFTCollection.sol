// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//Importing Openzeppelin package modules
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//Contract named - NFTCollection ( Representing NFT - ER721)
contract NFTCollection is ERC721Enumerable, Ownable {
    string[] private _tokenURIs;
    mapping(uint256 => string) private _tokenImages;
//Constructor
    constructor() ERC721("Your TV Characters Collection", "TVCHARS") {}
//Function To Mint NFT
    function mintNFT(string memory tokenURI, string memory imageURI) external onlyOwner {
        require(totalSupply() < 3000, "Maximum limit reached");
        uint256 tokenId = totalSupply() + 1;
        _mint(msg.sender, tokenId);
        _tokenURIs.push(tokenURI);
        _tokenImages[tokenId] = imageURI;
    }
//Function To Update Token Image
    function setTokenImage(uint256 tokenId, string memory newImageURI) external onlyOwner {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can change the image");
        _tokenImages[tokenId] = newImageURI;
    }
//Function To Get Token URI 
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId - 1];
    }
//Function To Fetch ImageURI
    function getImageURI(uint256 tokenId) external view returns (string memory) {
        return _tokenImages[tokenId];
    }
}
