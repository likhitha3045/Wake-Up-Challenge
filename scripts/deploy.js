import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
    console.log("Deploying WakeUpChallenge contract...");

    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deploying contract from: ${deployer.address}`);

    // Deploy contract
    const WakeUpChallenge = await hre.ethers.getContractFactory("WakeUpChallenge");
    const wakeUpChallenge = await WakeUpChallenge.deploy();

    await wakeUpChallenge.waitForDeployment();
    const contractAddress = await wakeUpChallenge.getAddress();

    console.log(`✅ WakeUpChallenge deployed to: ${contractAddress}`);

    // Save contract address and ABI
    const contractInfo = {
        address: contractAddress,
        network: hre.network.name,
        deployer: deployer.address,
        deploymentBlock: await hre.ethers.provider.getBlockNumber(),
        deploymentTime: new Date().toISOString(),
    };

    const abiPath = path.join(__dirname, "../frontend/src/contracts");
    if (!fs.existsSync(abiPath)) {
        fs.mkdirSync(abiPath, { recursive: true });
    }

    fs.writeFileSync(
        path.join(abiPath, "WakeUpChallenge.json"),
        JSON.stringify({
            address: contractInfo.address,
            abi: WakeUpChallenge.interface.formatJson(),
            info: contractInfo,
        }, null, 2)
    );

    console.log(`✅ Contract ABI saved to frontend/src/contracts/`);

    // Verify on Etherscan (optional)
    if (hre.network.name === "sepolia") {
        console.log("\n⏳ Waiting 30 seconds before verification...");
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        try {
            console.log("📜 Verifying contract on Etherscan...");
            await hre.run("verify:verify", {
                address: contractAddress,
                constructorArguments: [],
            });
            console.log("✅ Contract verified on Etherscan");
        } catch (error) {
            console.log("ℹ️  Verification skipped (may already be verified)");
        }
    }

    return contractInfo;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
