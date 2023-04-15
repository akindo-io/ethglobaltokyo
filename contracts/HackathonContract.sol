// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./WhitelistedERC20.sol";

interface IPUSHCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}

contract HackathonContract is Ownable, WhitelistedERC20 {

    using SafeERC20 for IERC20;

    struct Hackathon {
        address from;
        address erc20;
        address safeAddress;
        address channelAddress;
        uint256 depositAmount;
        uint256 wavePrize;
        uint256 waveSubmitTime;
        uint256 waveVoteTime;
        string hackathonId;
        string snapshotSpace;
    }

    mapping(string => Wave[]) private waves;
    mapping(string => uint256) private waveCount;

    struct Wave {
        WaveStatus status;
        uint256 submissionDeadline;
        uint256 votingDeadline;
        address[] submitAddresses;
        uint256[] votes;
        string hackathonId;
    }

    enum WaveStatus {
        None,
        Opening,
        Closed
    }

    string[] private hackathonIds;
    mapping(string => Hackathon) private _hackathons;

    address public pushCommAddress;

    constructor(address[] memory erc20List, address _pushCommAddress) {
        for (uint256 i; i < erc20List.length; i++) {
            addToWhitelist(erc20List[i]);
        }
        pushCommAddress = _pushCommAddress;
    }

    function open(address _erc20, address safeAddress, address _channelAddress, uint256 _wavePrize, uint256 _depositAmount, uint256 _waveSubmitTime, uint256 _waveVoteTime, string memory _hackathonId) external {
        Hackathon storage hackathon = _hackathons[_hackathonId];
        require(whitelisted(_erc20), "Token not whitelisted");

        hackathon.from = msg.sender;
        hackathon.safeAddress = safeAddress;
        hackathon.channelAddress = _channelAddress;
        hackathon.depositAmount = _depositAmount;
        hackathon.erc20 = _erc20;
        hackathon.hackathonId = _hackathonId;
        hackathon.wavePrize = _wavePrize;
        hackathon.waveSubmitTime = _waveSubmitTime;
        hackathon.waveVoteTime = _waveVoteTime;

        hackathonIds.push(_hackathonId);
        // deposit
        IERC20(_erc20).transferFrom(msg.sender, address(this), _depositAmount);
        // open wave
        _addWave(_hackathonId);
    }

    function close(string memory _hackathonId, uint256[] memory _votes) external {
        Hackathon storage hackathon = _hackathons[_hackathonId];
        Wave storage wave = waves[_hackathonId][waveCount[_hackathonId] - 1];
        require(_isOpenedWave(_hackathonId));
        require(wave.submissionDeadline < block.timestamp);

        if (hackathon.safeAddress != msg.sender || _votes.length != wave.submitAddresses.length) {
            return;
        }
        // transfer
        uint256 totalVotes = sumVotes(_votes);
        require(totalVotes > 0, "Total votes should be greater than 0.");

        for (uint256 i = 0; i < wave.submitAddresses.length; i++) {
            uint256 reward = ((hackathon.wavePrize * _votes[i] * 100) / totalVotes) / 100;
            IERC20(hackathon.erc20).safeTransfer(wave.submitAddresses[i], reward);
            hackathon.depositAmount -= reward;
        }

        wave.status = WaveStatus.Closed;
        wave.votes = _votes;
        // open wave
        _addWave(_hackathonId);
    }

    function _addWave(string memory _hackathonId) private {
        require(waveCount[_hackathonId] == 0 || _isClosedWave(_hackathonId));
        Hackathon storage hackathon = _hackathons[_hackathonId];

        if (hackathon.wavePrize < hackathon.depositAmount) {
            Wave memory wave;
            wave.hackathonId = _hackathonId;
            wave.status = WaveStatus.Opening;
            wave.submissionDeadline = block.timestamp + _hackathons[_hackathonId].waveSubmitTime;
            wave.votingDeadline = block.timestamp + _hackathons[_hackathonId].waveSubmitTime + _hackathons[_hackathonId].waveVoteTime;
            waves[_hackathonId].push(wave);
            waveCount[_hackathonId]++;
        }
        if (hackathon.channelAddress != address(0)) {
            IPUSHCommInterface(pushCommAddress).sendNotification(
                hackathon.channelAddress,
                address(this),
                bytes(
                    string(
                        abi.encodePacked(
                            "0",
                            "+",
                            "1",
                            "+",
                            "WaveProtocol",
                            "+",
                            "The wave hackathon has begun !!!!"
                        )
                    )
                )
            );
        }
    }

    function submitProduct(string memory _hackathonId) public {
        require(_isOpenedWave(_hackathonId), "Hackathon Wave is not yet open.");
        require(waveCount[_hackathonId] > 0);

        Wave storage wave = waves[_hackathonId][waveCount[_hackathonId] - 1];
        require(wave.status == WaveStatus.Opening);

        for (uint i = 0; i < wave.submitAddresses.length; i++) {
            require(wave.submitAddresses[i] != msg.sender, "already submitted");
        }

        wave.submitAddresses.push(msg.sender);
    }

    function getWave(string memory _hackathonId) public view returns (Wave memory) {
        return waves[_hackathonId][waveCount[_hackathonId] - 1];
    }

    function getWaves(string memory _hackathonId) public view returns (Wave[] memory) {
        return waves[_hackathonId];
    }

    function getHackathon(string memory _hackathonId) public view returns (Hackathon memory) {
        return _hackathons[_hackathonId];
    }

    function getHackathons() public view returns (string[] memory) {
        return hackathonIds;
    }

    function getSubmitProducts(string memory _hackathonId, uint256 index) public view returns (address[] memory) {
        return waves[_hackathonId][index].submitAddresses;
    }


    function _isOpenedWave(string memory _hackathonId) private view returns (bool)
    {
        Wave memory wave = waves[_hackathonId][waveCount[_hackathonId] - 1];
        return wave.status == WaveStatus.Opening;
    }

    function _isClosedWave(string memory _hackathonId) private view returns (bool)
    {
        Wave memory wave = waves[_hackathonId][waveCount[_hackathonId] - 1];
        return wave.status == WaveStatus.Closed;
    }

    function sumVotes(uint256[] memory _votes) private pure returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < _votes.length; i++) {
            total += _votes[i];
        }
        return total;
    }

    function getWaveCount(string memory _hackathonId) public view returns (uint256){
        require(waves[_hackathonId].length > 0);
        return waveCount[_hackathonId];
    }
}
