//SPDX-License-Identifier: MIT
pragma solidity > 0.4.22 <= 0.9.0;

contract VotingmultiUser {
    address public contract_owner;
    //uint public count; - not needed yet

    struct Proposal {
        bool vote;
    }

////////////////////////////////////////////////////////////////////
//this is for creating blocking variables
    mapping(address=> bool) public approvedVoters;
    mapping(address=> Proposal[]) private userVotes;
    //mapping(address=> uint) public voting_balance; - this hasnt been executed yet
////////////////////////////////////////////////////////////////////
//this gives instructions that only contract_owner can send info
    constructor(){
        contract_owner = msg.sender;
    }

    //this helps distiguished what users can do and what owner can do
    modifier onlyApproved(){
        require(approvedVoters[msg.sender]  == true, "Voter is not approved by contract owner");
        _;
    }
    modifier onlyOwner(){
        require(msg.sender == contract_owner, "Only owner can perform this action");
        _;
    }

    function approvedVoter(address _user) public onlyOwner{
        approvedVoters[_user] = true;
    }
    function revokeVoter(address _user) public onlyOwner{
        approvedVoters[_user] = false;
    }

    function castVote(bool _vote) public onlyApproved{
        userVotes[msg.sender].push(Proposal(_vote));
    }

    //this is the get functions
    function getVote() public view returns (Proposal[] memory){
        return userVotes[msg.sender];
    }
}