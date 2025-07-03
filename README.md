# 🗳️ Voting-multiuser-hardhat – Solidity dApp

This is a multi-user voting concept smart contract built with Solidity and tested using Hardhat. Each user has their own voting history, and only approved users can interact with the contract.

## Features

- Per-user voting history (`mapping(address => Proposal[])`)
- Role-based access control (contract_owner approves or revokes voters)
- Functions to cast votes, view vote history, and manage voter permissions
- Hardhat test suite for 4+ use cases, including failure cases
- Clean contract logic with modifiers and events
- Frontend integration with MetaMask

## Tech Stack

- Solidity ^0.8.0
- Hardhat (for testing + development)
- Ethers.js (for frontend contract interaction)
- Chai + Mocha (test assertions)
- Bootstrap (for simple UI styling)

## Project Structure

```contracts/
voting_multiUsers.sol # Main contract
frontend/
js/
app.js # Frontend logic
contract-address.js # Auto-generated contract address
index.html # Voting DApp UI
scripts/
deploy.js # Deployment script
test/
voting_multiUser.test.js # Full test suite
```
## Functions

| Function | Description |
|---------|-------------|
| `approvedVoter(address)` | Owner-only function to approve a new user |
| `revokeVoter(address)` | Owner-only function to revoke access |
| `castVote(bool)` | Approved users can cast a yes/no vote |
| `getVote()` | Returns the caller's personal voting history |
| `contract_owner()` | Returns the owner address of the contract |

## Tests

Hardhat test suite includes:
- Approving and revoking voters
- Casting votes (yes/no)
- Viewing vote history
- Reverts for unauthorized access attempts

Run the tests locally:
> `npx hardhat test` to run the suite

## Possible Future Additions

- Proposal Deadlines: Allow the contract owner to set time limits for votes, closing proposals automatically after expiration
- Vote Tallying: Display total yes/no votes in real-time for each proposal, enabling transparent community decisions.
- Role-Based Access Control: Introduce multiple roles (e.g., admin, moderator, voter) to delegate permissions for managing proposals and users.
- Event Emitters: Emit `VoteCast`, `VoterApproved`, and `VoterRevoked` events for off-chain listening and analytics dashboards.
- Testnet and Mainnet Deployment: Deploy the DApp to Ethereum testnets (e.g., Sepolia) for multi-user testing in a real-world environment.
- Frontend Enhancements: Integrate React or Vue for dynamic UI, with live MetaMask connection status and vote updates.
- Staked Voting: Require users to stake ETH or tokens to participate, adding weight to votes and discouraging spam.

---

Built by Steven Egoavil. 
