import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("MIRToken", function () {
  async function deployContractFixture() {
    const [owner, firstAcc, secondAcc, thirdAcc] = await hre.ethers.getSigners();
    const tokenFactory = await hre.ethers.getContractFactory("MIRToken");
    const MIRToken = await tokenFactory.deploy();
    return {owner, MIRToken, firstAcc, secondAcc, thirdAcc};
  } 

  describe("deployment", () => {
    it("check Admin", async() => {
      const {MIRToken, owner} = await loadFixture(deployContractFixture);
      expect(await MIRToken.getAdmin()).to.equal(owner);
    })
    it("has 1000 tokens in balance", async() => {
      const {MIRToken, owner} = await loadFixture(deployContractFixture);
      const balance = await MIRToken.balanceOf(owner)
      expect(balance).to.equal(1000);
    })
    it('should mint some tokens', async() => {
      const {MIRToken, owner} = await loadFixture(deployContractFixture)
      await MIRToken.mint(1000);
      expect(await MIRToken.balanceOf(owner)).to.equal(2000);
    })
    it('should not mint tokens', async() => {
      const {MIRToken, firstAcc} = await loadFixture(deployContractFixture)
      await expect(MIRToken.connect(firstAcc).mint(200)).to.be.revertedWith(
        "Only admin can call this funciton" // Update this message according to your contract
      );
    })
    it("should transfer some tokens to other account", async () => {
      const {MIRToken, owner, firstAcc} = await loadFixture(deployContractFixture)
      await MIRToken.transfer(firstAcc, 10);
      expect(await MIRToken.balanceOf(firstAcc)).to.equal(10);
    })
  })

}); 