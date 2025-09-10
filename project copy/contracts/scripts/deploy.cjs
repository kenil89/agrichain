// const hre = require("hardhat");

// async function main() {
//   console.log("Deploying SupplyChain contract...");

//   // // Get the ContractFactory and Signers here.
//   // const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  
//   // // Deploy the contract
//   // const supplyChain = await SupplyChain.deploy();
//   const AgriChain = await hre.ethers.getContractFactory("AgriChain");
//   const agriChain = await AgriChain.deploy();

//   await agriChain.deployed();
//   console.log("AgriChain deployed to:", agriChain.address);
  
//   await supplyChain.waitForDeployment();
  
//   const contractAddress = await supplyChain.getAddress();
  
//   console.log("SupplyChain deployed to:", contractAddress);
  
//   // Create some sample batches for testing
//   console.log("Creating sample batches...");
  
//   const [deployer, farmer, distributor, retailer] = await hre.ethers.getSigners();
  
//   // Create batch as farmer
//   const tx1 = await supplyChain.connect(farmer).createBatch(
//     "Organic Tomatoes",
//     100,
//     "Green Valley Farm, CA"
//   );
//   await tx1.wait();
//   console.log("Sample batch 1 created by farmer");
  
//   const tx2 = await supplyChain.connect(farmer).createBatch(
//     "Fresh Lettuce",
//     50,
//     "Sunny Acres Farm, OR"
//   );
//   await tx2.wait();
//   console.log("Sample batch 2 created by farmer");
  
//   const tx3 = await supplyChain.connect(farmer).createBatch(
//     "Organic Carrots",
//     75,
//     "Mountain View Farm, WA"
//   );
//   await tx3.wait();
//   console.log("Sample batch 3 created by farmer");
  
//   console.log("\nDeployment completed!");
//   console.log("Contract Address:", contractAddress);
//   console.log("Farmer Address:", farmer.address);
//   console.log("Distributor Address:", distributor.address);
//   console.log("Retailer Address:", retailer.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
// scripts/deploy.cjs
const hre = require("hardhat");

async function main() {
    console.log("Deploying AgriChain contract...");

    const AgriChain = await hre.ethers.getContractFactory("AgriChain");
    const agriChain = await AgriChain.deploy(); // deploy contract

    await agriChain.waitForDeployment(); // for Hardhat 3.x
    console.log("AgriChain deployed to:", agriChain.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
