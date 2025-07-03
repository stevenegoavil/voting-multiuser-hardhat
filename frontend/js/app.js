import { VOTING_CONTRACT_ADDRESS } from "./contract-address.js";
let contractAddress = VOTING_CONTRACT_ADDRESS; // this for copy of contract address

// Extract only the ABI
const importCounterArtifact = {
"abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "approvedVoter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "approvedVoters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_vote",
          "type": "bool"
        }
      ],
      "name": "castVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "contract_owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVote",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bool",
              "name": "vote",
              "type": "bool"
            }
          ],
          "internalType": "struct Voting_multiUser.Proposal[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "revokeVoter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
};

const abi = importCounterArtifact.abi;

let provider, signer, contract; // Define here, assign later

//to make it easier im going to assign function names to click events
//the follow functions can be used for every contract for testing/template purposes/ best practice for learning
const connectBtn = document.getElementById("connect"); //connects wallet/ displays contractid
const ownerBtn = document.getElementById("getOwner"); // displays contract owner private wallet address -best practice for beginner
const contractid = document.getElementById("getContractid"); //display contract id, which will not change for this frontend
const addUserBtn = document.getElementById("add-user");
const removeUserBtn = document.getElementById("remove-user");
//the following functions are specific to contract =>
const vote_yesBtn = document.getElementById("vote_yes");
const vote_noBtn = document.getElementById("vote_no");

//now just put function, makes code cleaner, find out what each button does at the top^


connectBtn.onclick = async () => {
  if (!window.ethereum) {
    alert("Issue could be the following: Install MetaMask Plugin, Browser Security Block");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();


  contract = new ethers.Contract(contractAddress, abi, signer);

  const address = await signer.getAddress();
  document.getElementById("walletAddress").innerText = `Connected: ${address}`;
  await voteCastedResult();
};

ownerBtn.onclick = async () => {
  if (!contract) return;

  try {
    const ownerAddress = await contract.contract_owner();
    ownerDisplay.innerText = `Contract Owner: ${ownerAddress}`;
  } catch (error) {
    updateStatus(`Failed to fetch owner: ${error.message}`, "danger");
  }
};

contractid.onclick = async () => {
  if (contractAddress) {
    document.getElementById("contractDisplay").innerText = `Contract: ${contractAddress}`;
  } else {
    updateStatus("Contract not loaded", "warning");
  }
};

addUserBtn.onclick = async () => {
  if (!contract) return;

  const addressInput = document.getElementById("user-address").value;
  if (!ethers.utils.isAddress(addressInput)) {
    updateStatus("Enter a valid Ethereum address", "warning");
    return;
  }

  try {
    const tx = await contract.approvedVoter(addressInput)
    updateStatus("Approving User...");
    await tx.wait();
    updateStatus(`User ${addressInput} approved!`);
    } catch (error){
    updateStatus(`Failed to approve ${error.message}`, "danger")
    };
}

removeUserBtn.onclick = async () => {
  if (!contract) return;

  const addressInput = document.getElementById("user-address").value;
  if (!ethers.utils.isAddress(addressInput)) {
    updateStatus("Enter a valid Ethereum address", "warning");
    return;
  }

  try {
    const tx = await contract.revokeVoter(addressInput)
    updateStatus("Revoking User...");
    await tx.wait();
    updateStatus(`User ${addressInput} revoked!`);
    } catch (error){
    updateStatus(`Failed to revoke ${error.message}`, "danger")
    };
}

vote_yesBtn.onclick = async () => {
  try {
    const tx = await contract.castVote(true);
    updateStatus("Voting YES...");
    await tx.wait();
    updateStatus("Vote submitted");
    await voteCastedResult();
  } catch (err) {
    updateStatus(`Vote failed: ${err.message}`, "danger");
  }
};

vote_noBtn.onclick = async () => {
  try {
    const tx = await contract.castVote(false);
    updateStatus("Voting NO...");
    await tx.wait();
    updateStatus("Vote submitted");
    await voteCastedResult();
  } catch (err) {
    updateStatus(`Vote failed: ${err.message}`, "danger");
  }
};

voteCastedResult = async () => {
  if (!contract || !signer) return;

  try {
    const votes = await contract.getVote();
    const latestVote = votes.length ? votes[votes.length - 1].vote : "No votes yet";
    document.getElementById("voteCastedResult").innerText = `Latest Vote: ${latestVote}`;
  } catch (err) {
    document.getElementById("voteCastedResult").innerText = "Could not fetch votes.";
  }
}


function updateStatus (message, type = "info") {
  const statusDisplay = document.getElementById("status");
  statusDisplay.innerText = message;
  statusDisplay.className = `alert alert-${type}`;
  statusDisplay.style.display = "block";
}