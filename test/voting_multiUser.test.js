const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting_multiUser", function () {
  let votingContract;
  let owner;
  let voter1;
  let voter2;

  beforeEach(async function () {
    const Voting = await ethers.getContractFactory("VotingmultiUser");
    [owner, voter1, voter2] = await ethers.getSigners();
    votingContract = await Voting.deploy();
  });

  it("should allow owner to approve a voter", async function () {
    await votingContract.approvedVoter(voter1.address);
    expect(await votingContract.approvedVoters(voter1.address)).to.equal(true);
  });

  it("should allow an approved voter to cast a vote", async function () {
    await votingContract.approvedVoter(voter1.address);
    const votingAsVoter1 = votingContract.connect(voter1);

    await votingAsVoter1.castVote(true);

    const votes = await votingAsVoter1.getVote();
    expect(votes.length).to.equal(1);
    expect(votes[0].vote).to.equal(true);
  });

  it("should revert if unapproved user tries to vote", async function () {
    const votingAsVoter2 = votingContract.connect(voter2);

    await expect(
      votingAsVoter2.castVote(true)
    ).to.be.revertedWith("Voter is not approved by contract owner");
  });
});