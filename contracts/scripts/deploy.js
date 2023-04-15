const {ethers} = require("hardhat");

async function main(address) {
    const Hackathon = await ethers.getContractFactory("HackathonContract");
    if (!address) {
        address = '0x07865c6e87b9f70255377e024ace6630c1eaa37f';
    }
    const hackathon = await Hackathon.deploy([address]);

    // コントラクトのデプロイ
    await hackathon.deployed();

    // コントラクトのアドレスを表示
    console.log("Hackathon deployed to:", hackathon.address);
    return hackathon.address;
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

exports.deploy = main
