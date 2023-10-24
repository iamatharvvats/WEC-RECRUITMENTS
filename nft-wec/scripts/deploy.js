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
