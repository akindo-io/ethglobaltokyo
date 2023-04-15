/* global describe it before ethers */

const {deploy} = require('../scripts/deploy.js')

const {expect} = require('chai')
const {waffle, ethers} = require('hardhat');
const {deployMockContract, provider} = waffle;

describe('HackathonTest', async function () {
    let hackathonContract;
    let owner
    let submiter1;
    let submiter2;
    let addrs
    let hackathonId = 'EthGlobalTokyo'
    let token
    let safeAddress
    let IPUSHCommAddress
    let mockedERC20Contract
    let mockedIPUSHCommInterface
    let status = {None: 0, Opening: 1, Closed: 2};

    before(async function () {
        [owner, token, safeAddress, IPUSHCommAddress, submiter1, submiter2, ...addrs] = await ethers.getSigners();

        // interface
        const [deployerOfERC20Contract, deployerOfIPUSHCommInterface] = provider.getWallets();
        // deploy the contract to Mock
        const ERC20Contract = require('./SafeERC20.json');
        const IPUSHCommInterface = require('./IPUSHCommInterface.json');
        mockedERC20Contract = await deployMockContract(deployerOfERC20Contract, ERC20Contract.abi);
        mockedIPUSHCommInterface = await deployMockContract(deployerOfIPUSHCommInterface, IPUSHCommInterface.abi);
        await mockedERC20Contract.mock.transfer.returns(true);
        await mockedERC20Contract.mock.transferFrom.returns(true);
        await mockedERC20Contract.mock.approve.returns(true);
        await mockedIPUSHCommInterface.mock.sendNotification.returns();

        deployAddress = await deploy(mockedERC20Contract.address, mockedIPUSHCommInterface.address);
        hackathonContract = await ethers.getContractAt('HackathonContract', deployAddress)
    })

    it('open hackathon', async () => {
        await hackathonContract.open(
            mockedERC20Contract.address,
            safeAddress.address,
            mockedIPUSHCommInterface.address,
            10,
            1000,
            600, // 10min
            600, // 10min
            hackathonId
        );
        expect(await hackathonContract.getWaveCount(hackathonId)).equal(1);
        let wave = await hackathonContract.getWave(hackathonId);
        expect(wave.hackathonId).equal(hackathonId);

        // submit hackathon
        await hackathonContract.connect(submiter1).submitProduct(hackathonId);
        await hackathonContract.connect(submiter2).submitProduct(hackathonId);
        let submitProduts = await hackathonContract.getSubmitProducts(hackathonId, 0);
        expect(submitProduts.length).equal(2);
        expect(submitProduts[0]).equal(submiter1.address);
        expect(submitProduts[1]).equal(submiter2.address);

        // close hackathon
        await expect(hackathonContract.close(hackathonId, [60, 40])).reverted;
        await expect(hackathonContract.connect(safeAddress).close(hackathonId, [60, 40])).reverted;

        await ethers.provider.send("evm_increaseTime", [1800]);
        await ethers.provider.send("evm_mine", []);

        await hackathonContract.connect(safeAddress).close(hackathonId, [60, 40])

        expect(await hackathonContract.getWaveCount(hackathonId)).equal(2);
        let waves = await hackathonContract.getWaves(hackathonId);
        expect(waves.length).equal(2);
        expect(waves[0].status).equal(status.Closed);
        expect(waves[0].votes.length).equal(2);
        expect(waves[0].votes[0]).equal(60);
        expect(waves[0].votes[1]).equal(40);
        expect(waves[1].status).equal(status.Opening);

        let hackathon = await hackathonContract.getHackathon(hackathonId);
        expect(hackathon.depositAmount).equal(990);

        await ethers.provider.send("evm_increaseTime", [-1800]);
        await ethers.provider.send("evm_mine", []);
    })

})