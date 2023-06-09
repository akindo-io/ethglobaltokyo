/* global ethers task */
require('@nomiclabs/hardhat-waffle')
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config({ path: '.contract.env' })

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
    const accounts = await ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: '0.8.19',
    settings: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
    networks: {
        goerli: {
            url: process.env.ALCHEMY_API_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: {
            goerli: process.env.POLYGON_SCAN_API_KEY
        }
    }
}
