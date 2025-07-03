const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
/////////////////////////////////////////////////////////////////////////////////////////
//this is a new concept, we are trying to make contract address to populate on the frontend manually
//instead of copying from local network, to ensure bestpractice and enable realwork function


let voting_multiuserTrigger = async () => {
    try{
        const voting_multiuser = await hre.ethers.getContractFactory("VotingmultiUser");
        const contract = await voting_multiuser.deploy();

        await contract.waitForDeployment();

        console.log("Solidity contract voting_multiuser deployed to:", contract.address);
        const frontendPath = path.resolve(__dirname, "../frontend/js/contract-address.js");
        fs.writeFileSync(
            frontendPath,
            `export const VOTING_CONTRACT_ADDRESS = "${contract.target}";\n`
        );

        console.log("Contract address written to:", frontendPath);

        process.exitCode = 0;
    }
    catch(error){
        console.log(error, "Error, ");
        process.exitCode = 1;
    }
}

voting_multiuserTrigger();