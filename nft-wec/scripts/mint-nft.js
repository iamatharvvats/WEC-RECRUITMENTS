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

