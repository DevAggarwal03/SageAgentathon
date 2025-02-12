import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("CLKToken", function () {
  async function deployContractFixture() {
    const [owner, firstAcc, secondAcc, thirdAcc] = await hre.ethers.getSigners();
    const tokenFactory = await hre.ethers.getContractFactory("CLKToken");
    const CLKToken = await tokenFactory.deploy();
    return {owner, CLKToken, firstAcc, secondAcc, thirdAcc};
  } 

  describe("deployment", () => {
    it("check Admin", async() => {
      const {CLKToken, owner} = await loadFixture(deployContractFixture);
      expect(await CLKToken.getAdmin()).to.equal(owner);
    })
    it("has 1000 tokens in balance", async() => {
      const {CLKToken, owner} = await loadFixture(deployContractFixture);
      const balance = await CLKToken.balanceOf(owner)
      expect(balance).to.equal(1000);
    })
    it('should mint some tokens', async() => {
      const {CLKToken, owner} = await loadFixture(deployContractFixture)
      await CLKToken.mint(1000);
      expect(await CLKToken.balanceOf(owner)).to.equal(2000);
    })
    it('should not mint tokens', async() => {
      const {CLKToken, firstAcc} = await loadFixture(deployContractFixture)
      await expect(CLKToken.connect(firstAcc).mint(200)).to.be.revertedWith(
        "Only admin can call this funciton" // Update this message according to your contract
      );
    })
    it("should transfer some tokens to other account", async () => {
      const {CLKToken, owner, firstAcc} = await loadFixture(deployContractFixture)
      await CLKToken.transfer(firstAcc, 10);
      expect(await CLKToken.balanceOf(firstAcc)).to.equal(10);
    })
  })

});
