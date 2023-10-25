# WEC-RECRUITMENTS
# WEC-RECRUITMENTS - PROJECT 1 : MINTING NFT
# VIDEO LINK<br>
URL : https://drive.google.com/file/d/1eOMjoEg0aWF5Xjg_tN8nCXAsxLVdhcdc/view?usp=drive_link <br>
// GDSC - SYSTEMS INTER SIG PROJECT - MINTING OF TV - CHARACTERS NFT COLLECTION

The project is basically build upon using VS-Code as editor, hardhat as local development environment,  solidity language as smart contract, alchemy, ether.js, pinata as IPFS (Interplanetary File Management System ) to store my 
images. The Testnet used is Sepolia.

So, lets get started .........

First I created an app using alchemy and stored the api key and api url in .env file in the root directory named NFT-WEC.
Now install metamask (I already had) and choose the desired testnet, get some fake money(SepoliaETH) using several faucets available.
Now its time to install hardhat and choose to create an empty hardhat.congif.js, make directories : contracts and scripts in your root directory and yes we are good to go.

Using code editor i.e. VS-Code now, write a smart contract named : NFTCollection with sol extension indicating a solidity file inside the contracts named directory.

File : NFTCollection.sol
Important : Make sure that the version defined above (^0.8.20) is the same as the version defined in the hardhat.config.js file.
Now import the three classes from the openzeppelin package.

1. "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol" : contains the implementation of an ERC721 token contract with additional functionality to enumerate (list) all tokens of a specific owner or within the entire contract.
2. @openzeppelin/contracts/utils/Counters.sol  : Provides counters that can only be incremented or decremented by one.
   Our smart contract uses a counter to keep track of the total number of NFTs minted and set the unique ID to our new NFT.
3. @openzeppelin/contracts/access/Ownable.sol sets up access control on our smart contract, so only the owner of the smart contract (you) can mint NFTs.

OpenZepplin contracts helps to  implement most of the methods we need to create an NFT.

you'll notice we pass 2 strings, "Your TV Characters Collection" & "TVCHARS" into the ERC721 constructor. 
The first variable is the smart contract's name, and the second is its symbol.
```
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
```

we have our function mintNFT() that allows us to mint an NFT! You'll notice this function takes in two variables: TokenURI and ImageURI
A URI (Uniform Resource Identifier) is used to identify the metadata associated with an NFT, 
which typically includes information such as the name, description, and image of the NFT. 
Next a Function To Update Token Image is created which takes in the tokenId and newImageURI and hence, it changes the image of that particluar tpoken Id with the newImage.
Bascially ImageURI at that particluar tokenId in _tokenImages is changed.

Now. last two methods are to basically to return the tokenURI and the ImageURI, Both take as a parameter TokenId.

Also, store your private key of metamask wallet in the environment filr (.env).

Now, its time to update hardhat.config.js  file .
```
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
```
First, we will fetch the required passwd/keys from the .env file using require('dotenv').config(). 
require("@nomiclabs/hardhat-ethers") =>
This plugin brings to Hardhat the Ethereum library ethers.js , which allows you to interact with the Ethereum blockchain in a simple way.
nomiclabs foundation is the creator of hardhat.
Now, make sure that the solidity version mentioned here is the same as the one in the contract created.
Network is sepolia, testnet. 

In this way we are able to interact together with our metamask wallet, alchemy account and the smart contract.

Now that our contract is written and our configuration file is good to go, it’s time to write the contract deploy script.

Navigate to the scripts/ folder and name the file as deploy.js
```
const { ethers } = require("hardhat");
async function main() {
    // Grab the contract factory 
    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    
    // Start deployment, returning a promise that resolves to a contract object
    const nftCollection = await NFTCollection.deploy();
    await nftCollection.deployed();

    console.log("NFT Collection deployed to:", nftCollection.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
```  
***The statement const { ethers } = require("hardhat"); in JavaScript is used to import the ethers module from the "hardhat" package.
The ethers library is widely used in Ethereum development for interacting with smart contracts, creating wallets, and sending transactions.
 Basically, getContractFactory is an inbuilt function of the ethers library. It creates a primary contract and this smart contract contains a function that creates an instance 
 of the contract based on the behaviour of our primary contract. 
 Using inbuilt-function deploy() we can easily deploy our contract and hence fetch the address to which it is deployed using nftCollection.address. 
 Calling deploy() on a ContractFactory will start the deployment, and return a Promise that resolves to a Contract. 
 This is the object that has a method for each of our smart contract functions.
 Now that we have successfully deployed a smart contract to the Sepolia network, let's mint NFT!

 create a new file in the scripts folder called mint-nft.js.
 ********************************************************
 ```
 require('dotenv').config();
const ethers = require('ethers');

// Get Alchemy API Key
const API_KEY = process.env.API_KEY;

// Define an Alchemy Provider
const provider = new ethers.AlchemyProvider('sepolia', API_KEY)

//Fetching abi
const contract = require("C:/Users/ATHARV VATS/nft-wec/artifacts/contracts/NFTCollection.sol/NFTCollection.json");

// Get contract ABI and address
const abi = contract.abi
const contractAddress = '0x3f4Fab1392212158eFF752F99AbEbD0F64513E4d'

//Create a signer
const privateKey = process.env.PRIVATE_KEY
const signer = new ethers.Wallet(privateKey, provider)

// Create a contract instance
const NFTCollection = new ethers.Contract(contractAddress, abi, signer)

// Get the NFT Metadata IPFS URL
const tokenUri = "https://gateway.pinata.cloud/ipfs/QmYueiuRNmL4MiA2GwtVMm6ZagknXnSpQnB3z2gWbz36hP"
const Imageuri = "https://gateway.pinata.cloud/ipfs/QmVhGk8FJrm3kkRy2DXG9og6JNjYjGw18gAhccjKt9CBF7"

// Call mintNFT function
const mintNFT = async () => {
    let nftTxn = await NFTCollection.mintNFT(tokenUri,Imageuri)
    await nftTxn.wait()
    console.log(`NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`)

    // Update the image of an NFT
    const tokenIdToChange = 1; // Change the image of the first NFT
    const newImageURI = "https://gateway.pinata.cloud/ipfs/QmewuDUVnVVSb7wiiSoBVKNNzxqoAWBPHNFML3NmYvz26U";
    await NFTCollection.setTokenImage(tokenIdToChange, newImageURI);
    console.log("NFT minted and image updated.");
}

mintNFT()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```
*First line is used to fetch the required keys from the .env file.
Next we import the ether.js library to carry oout the desired functions available in it.
An important step here is to create a Provider : Here we are creating an alchemy provider.

What does providers do : to do things like calling read-only functions in smart contracts, fetching balances of accounts, 
fetching transaction details, etc.
Using inbuilt function from ethers module,
const provider = new ethers.AlchemyProvider('sepolia', API_KEY)
It takes two parameters : network i.e. sepolia and your api (alchemy api key)

Important : Whenever we compile a smart contract it is compiled down to byte-code which is mainly binary. 
This byte-code does not containg any information regarding the parameters and functionsinvloved in the smart contract. 
Hardhat automatically generates an ABI for us and saves it in the NFTCollection.json file.
So, when we compile a solidity smart contract it generates a json file that contains metadata and description regarding contract called ABI(Aplication Binary Interface). 
So, in this way abis are very useful as they can convert human readable functions  into a byte code or vice-versa and can be used simulataneously
whenever needed.
So, next is to fetch the abi from the json file.
```
//Fetching abi
const contract = require("C:/Users/ATHARV VATS/nft-wec/artifacts/contracts/NFTCollection.sol/NFTCollection.json");
const abi = contract.abi
```
After creating an alchemy provider and fetching the abi , next step is to generate a signer which is agian a very important tool to connect to the 
ethereum node which unlike provider gives the benefit of updation and write data to the blockchain.
"Wallet" inbuilt function is used from the ethers module which contains two parameters : the provider and the private key of your metamask wallet.
In order to be able to call the functions on our deployed contract, we need to define an ethers Signer using our wallet's private key.
//Create a signer
const signer = new ethers.Wallet(privateKey, provider)

Now, we will create a contract instance by passing 3 arguments : contract deployed address, abi and the signer.
// Create a contract instance
const NFTCollection = new ethers.Contract(contractAddress, abi, signer)

Next step is to Configure the metadata of your NFT using IPFS.

Our mintNFT smart contract function takes in a tokenURI parameter that should resolve to a JSON document describing the NFT's metadata.
which is really what brings the NFT to life, allowing it to have configurable properties, such as a name, description, image, and other attributes.
We will use Pinata, a convenient IPFS API and toolkit, to store our NFT asset and metadata and ensure that our NFT is truly decentralized. 

You can view your upload at: https://gateway.pinata.cloud/ipfs/<hash-code(cid)>

In your root directory, make a new file called nft-metadata.json and finally upload it on IPFS - pinata.

Now, its time to finally call the mintNFT function of the smart contract.
After this by passing the new ImageURI call the settokenImage function to update exchange the images.

=====>>>>>>>>The screenshots are provide alongwith.

Links :
Pinata : https://app.pinata.cloud/pinmanager
Token Uri : https://crimson-patient-gorilla-331.mypinata.cloud/ipfs/QmdRahdVVsTKfRfoCbL8bXiR3cYMHzznkVgp48L3dNmoyV?_gl=1*1mskm3r*_ga*NjM2MTc0NDYuMTY5NjcxMDc0Ng..*_ga_5RMPXG14TE*MTY5ODE2Mzg0MC4xMS4xLjE2OTgxNjM5NzMuMTYuMC4w
Deployed Contract : https://sepolia.etherscan.io/address/0x49D204d50b6C7bE393cFe7FBc961256E6F3060B7
Mint Link : https://sepolia.etherscan.io/tx/0xb4cd7459abdaaaee6249aa92c96491a26649ea57ce8ad536ffb7580fee10dcda
****************************************************************************************************************************************************************************
