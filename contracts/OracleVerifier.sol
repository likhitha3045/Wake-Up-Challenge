// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title OracleVerifier
 * @dev Mock oracle for verifying user activity
 */
contract OracleVerifier {
    mapping(address => mapping(bytes32 => bool)) public verifications;
    address public owner;

    event ActivityVerified(address indexed user, string activity, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    function verifyActivity(
        address _user,
        string memory _activityType,
        uint256 _timestamp
    ) external onlyOwner {
        bytes32 key = keccak256(abi.encodePacked(_user, _timestamp));
        verifications[_user][key] = true;
        emit ActivityVerified(_user, _activityType, _timestamp);
    }

    function isActivityVerified(address _user, uint256 _timestamp) external view returns (bool) {
        bytes32 key = keccak256(abi.encodePacked(_user, _timestamp));
        return verifications[_user][key];
    }
}
