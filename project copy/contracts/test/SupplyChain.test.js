const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
  let SupplyChain;
  let supplyChain;
  let owner;
  let farmer;
  let distributor;
  let retailer;

  beforeEach(async function () {
    [owner, farmer, distributor, retailer] = await ethers.getSigners();
    
    SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplyChain = await SupplyChain.deploy();
    await supplyChain.waitForDeployment();
  });

  describe("Batch Creation", function () {
    it("Should create a new batch", async function () {
      const tx = await supplyChain.connect(farmer).createBatch(
        "Organic Tomatoes",
        100,
        "Green Valley Farm"
      );
      
      await expect(tx)
        .to.emit(supplyChain, "BatchCreated")
        .withArgs(1, farmer.address, "Organic Tomatoes");

      const batch = await supplyChain.getBatchDetails(1);
      expect(batch.productType).to.equal("Organic Tomatoes");
      expect(batch.quantity).to.equal(100);
      expect(batch.farmer).to.equal(farmer.address);
      expect(batch.currentOwner).to.equal(farmer.address);
    });

    it("Should increment batch ID", async function () {
      await supplyChain.connect(farmer).createBatch("Product 1", 50, "Farm 1");
      await supplyChain.connect(farmer).createBatch("Product 2", 75, "Farm 2");
      
      const totalBatches = await supplyChain.getTotalBatches();
      expect(totalBatches).to.equal(2);
    });
  });

  describe("Batch Transfer", function () {
    beforeEach(async function () {
      await supplyChain.connect(farmer).createBatch(
        "Organic Tomatoes",
        100,
        "Green Valley Farm"
      );
    });

    it("Should transfer batch to distributor", async function () {
      const tx = await supplyChain.connect(farmer).transferBatch(
        1,
        distributor.address,
        "123456"
      );

      await expect(tx)
        .to.emit(supplyChain, "BatchTransferred")
        .withArgs(1, farmer.address, distributor.address);

      const batch = await supplyChain.getBatchDetails(1);
      expect(batch.currentOwner).to.equal(distributor.address);
    });

    it("Should fail if not batch owner", async function () {
      await expect(
        supplyChain.connect(distributor).transferBatch(
          1,
          retailer.address,
          "123456"
        )
      ).to.be.revertedWith("Not the batch owner");
    });

    it("Should fail with invalid OTP", async function () {
      await expect(
        supplyChain.connect(farmer).transferBatch(
          1,
          distributor.address,
          "123"
        )
      ).to.be.revertedWith("OTP must be 6 characters");
    });
  });

  describe("Final Price", function () {
    beforeEach(async function () {
      await supplyChain.connect(farmer).createBatch(
        "Organic Tomatoes",
        100,
        "Green Valley Farm"
      );
      await supplyChain.connect(farmer).transferBatch(
        1,
        retailer.address,
        "123456"
      );
    });

    it("Should add final price", async function () {
      const price = 599; // $5.99 in cents
      const tx = await supplyChain.connect(retailer).addFinalPrice(1, price);

      await expect(tx)
        .to.emit(supplyChain, "FinalPriceAdded")
        .withArgs(1, price);

      const batch = await supplyChain.getBatchDetails(1);
      expect(batch.finalPrice).to.equal(price);
    });

    it("Should fail if not batch owner", async function () {
      await expect(
        supplyChain.connect(farmer).addFinalPrice(1, 599)
      ).to.be.revertedWith("Not the batch owner");
    });
  });

  describe("Certificate Upload", function () {
    beforeEach(async function () {
      await supplyChain.connect(farmer).createBatch(
        "Organic Tomatoes",
        100,
        "Green Valley Farm"
      );
      await supplyChain.connect(farmer).transferBatch(
        1,
        retailer.address,
        "123456"
      );
    });

    it("Should upload certificate hash", async function () {
      const ipfsHash = "QmTestHash123";
      const tx = await supplyChain.connect(retailer).uploadCertificateHash(1, ipfsHash);

      await expect(tx)
        .to.emit(supplyChain, "CertificateUploaded")
        .withArgs(1, ipfsHash);

      const batch = await supplyChain.getBatchDetails(1);
      expect(batch.certificateHash).to.equal(ipfsHash);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await supplyChain.connect(farmer).createBatch(
        "Organic Tomatoes",
        100,
        "Green Valley Farm"
      );
      await supplyChain.connect(farmer).createBatch(
        "Fresh Lettuce",
        50,
        "Sunny Farm"
      );
    });

    it("Should return batches by owner", async function () {
      const farmerBatches = await supplyChain.getBatchesByOwner(farmer.address);
      expect(farmerBatches.length).to.equal(2);
      expect(farmerBatches[0]).to.equal(1);
      expect(farmerBatches[1]).to.equal(2);
    });

    it("Should return transfer history", async function () {
      await supplyChain.connect(farmer).transferBatch(
        1,
        distributor.address,
        "123456"
      );
      
      const history = await supplyChain.getBatchTransferHistory(1);
      expect(history.length).to.equal(2);
      expect(history[0]).to.equal(farmer.address);
      expect(history[1]).to.equal(distributor.address);
    });
  });
});