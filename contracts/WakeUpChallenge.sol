// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title WakeUpChallenge
 * @dev Smart contract for wake-up challenge with deposits and social features
 */
contract WakeUpChallenge is Ownable, ReentrancyGuard {
    
    // Challenge Status
    enum ChallengeStatus {
        ACTIVE,
        COMPLETED,
        FAILED,
        CANCELLED
    }
    
    // User Challenge Info
    struct Challenge {
        address user;
        uint256 depositAmount;
        uint256 wakeUpTime; // Unix timestamp for daily wake-up time
        uint256 startDate;
        uint256 endDate;
        ChallengeStatus status;
        uint256 daysCompleted;
        uint256 totalDays;
        mapping(uint256 => bool) wokenUpToday; // day index => woken up
        bool withdrawn;
    }
    
    // Social Challenge
    struct SocialChallenge {
        uint256 id;
        address[] participants;
        uint256 depositAmount;
        uint256 wakeUpTime;
        uint256 startDate;
        uint256 endDate;
        address winner;
        bool completed;
        mapping(address => uint256) successDays;
        mapping(address => bool) joinedUsers;
    }
    
    // User Profile
    struct UserProfile {
        address userAddress;
        uint256 totalDeposited;
        uint256 totalBurned;
        uint256 totalReturned;
        uint256 successfulChallenges;
        uint256 failedChallenges;
        uint256[] activeChallengeIds;
    }
    
    // State Variables
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => SocialChallenge) public socialChallenges;
    mapping(address => uint256[]) public userChallenges;
    
    uint256 public challengeCounter = 0;
    uint256 public socialChallengeCounter = 0;
    uint256 public totalBurned = 0;
    uint256 public totalReturned = 0;
    
    // Oracle Address (for verification)
    address public oracleAddress;
    
    // Events
    event ChallengeCreated(
        uint256 indexed challengeId,
        address indexed user,
        uint256 depositAmount,
        uint256 wakeUpTime,
        uint256 duration
    );
    
    event WakeUpConfirmed(
        uint256 indexed challengeId,
        address indexed user,
        uint256 dayIndex,
        uint256 timestamp
    );
    
    event ChallengeCompleted(
        uint256 indexed challengeId,
        address indexed user,
        uint256 returnAmount
    );
    
    event DepositBurned(
        uint256 indexed challengeId,
        address indexed user,
        uint256 burnAmount
    );
    
    event SocialChallengeCreated(
        uint256 indexed socialChallengeId,
        address[] participants,
        uint256 depositAmount
    );
    
    event SocialChallengeCompleted(
        uint256 indexed socialChallengeId,
        address indexed winner,
        uint256 rewardAmount
    );
    
    // Modifiers
    modifier onlyOracle() {
        require(msg.sender == oracleAddress || msg.sender == owner(), "Only oracle can call");
        _;
    }
    
    modifier validChallenge(uint256 _challengeId) {
        require(_challengeId < challengeCounter, "Invalid challenge ID");
        require(challenges[_challengeId].user != address(0), "Challenge does not exist");
        _;
    }
    
    // Constructor
    constructor() {
        oracleAddress = msg.sender;
    }
    
    /**
     * @dev Set oracle address
     */
    function setOracleAddress(address _oracleAddress) external onlyOwner {
        require(_oracleAddress != address(0), "Invalid oracle address");
        oracleAddress = _oracleAddress;
    }
    
    /**
     * @dev Create a new challenge - user deposits funds
     */
    function createChallenge(
        uint256 _depositAmount,
        uint256 _wakeUpTime,
        uint256 _durationDays
    ) external payable nonReentrant returns (uint256) {
        require(msg.value == _depositAmount, "Incorrect deposit amount");
        require(_depositAmount > 0, "Deposit must be greater than 0");
        require(_durationDays > 0 && _durationDays <= 365, "Invalid duration");
        require(_wakeUpTime < 86400, "Invalid wake-up time (must be seconds in day)");
        
        uint256 challengeId = challengeCounter;
        
        Challenge storage newChallenge = challenges[challengeId];
        newChallenge.user = msg.sender;
        newChallenge.depositAmount = _depositAmount;
        newChallenge.wakeUpTime = _wakeUpTime;
        newChallenge.startDate = block.timestamp;
        newChallenge.endDate = block.timestamp + (_durationDays * 1 days);
        newChallenge.status = ChallengeStatus.ACTIVE;
        newChallenge.daysCompleted = 0;
        newChallenge.totalDays = _durationDays;
        newChallenge.withdrawn = false;
        
        userChallenges[msg.sender].push(challengeId);
        
        UserProfile storage profile = userProfiles[msg.sender];
        profile.userAddress = msg.sender;
        profile.totalDeposited += _depositAmount;
        profile.activeChallengeIds.push(challengeId);
        
        challengeCounter++;
        
        emit ChallengeCreated(
            challengeId,
            msg.sender,
            _depositAmount,
            _wakeUpTime,
            _durationDays
        );
        
        return challengeId;
    }
    
    /**
     * @dev Confirm user woke up on time
     */
    function confirmWakeUp(uint256 _challengeId) external validChallenge(_challengeId) {
        Challenge storage challenge = challenges[_challengeId];
        require(challenge.user == msg.sender, "Not challenge owner");
        require(challenge.status == ChallengeStatus.ACTIVE, "Challenge not active");
        require(block.timestamp < challenge.endDate, "Challenge ended");
        
        // Calculate current day index
        uint256 dayIndex = (block.timestamp - challenge.startDate) / 1 days;
        require(dayIndex < challenge.totalDays, "Day index out of range");
        
        // Check if not already confirmed
        require(!challenge.wokenUpToday[dayIndex], "Already confirmed for today");
        
        // Verify time is correct (within wake-up window)
        uint256 todayStart = challenge.startDate + (dayIndex * 1 days);
        uint256 timeOfDay = block.timestamp - todayStart;
        
        require(timeOfDay <= challenge.wakeUpTime, "Too late - missed wake-up time");
        
        challenge.wokenUpToday[dayIndex] = true;
        challenge.daysCompleted++;
        
        emit WakeUpConfirmed(_challengeId, msg.sender, dayIndex, block.timestamp);
    }
    
    /**
     * @dev Finalize challenge - process rewards or penalties
     */
    function finalizeChallenge(uint256 _challengeId) external nonReentrant validChallenge(_challengeId) {
        Challenge storage challenge = challenges[_challengeId];
        require(challenge.user == msg.sender, "Not challenge owner");
        require(block.timestamp >= challenge.endDate, "Challenge not ended");
        require(!challenge.withdrawn, "Already withdrawn");
        require(challenge.status == ChallengeStatus.ACTIVE, "Challenge already finalized");
        
        challenge.withdrawn = true;
        
        // Check if user completed all days
        if (challenge.daysCompleted == challenge.totalDays) {
            // User succeeded - return deposit
            challenge.status = ChallengeStatus.COMPLETED;
            totalReturned += challenge.depositAmount;
            
            UserProfile storage profile = userProfiles[msg.sender];
            profile.totalReturned += challenge.depositAmount;
            profile.successfulChallenges++;
            
            (bool sent, ) = payable(msg.sender).call{value: challenge.depositAmount}("");
            require(sent, "Failed to return deposit");
            
            emit ChallengeCompleted(_challengeId, msg.sender, challenge.depositAmount);
        } else {
            // User failed - burn deposit
            challenge.status = ChallengeStatus.FAILED;
            totalBurned += challenge.depositAmount;
            
            UserProfile storage profile = userProfiles[msg.sender];
            profile.totalBurned += challenge.depositAmount;
            profile.failedChallenges++;
            
            emit DepositBurned(_challengeId, msg.sender, challenge.depositAmount);
        }
    }
    
    /**
     * @dev Create a social challenge
     */
    function createSocialChallenge(
        address[] calldata _participants,
        uint256 _depositAmount,
        uint256 _wakeUpTime,
        uint256 _durationDays
    ) external payable returns (uint256) {
        require(_participants.length >= 2, "Need at least 2 participants");
        require(msg.value == _depositAmount * _participants.length, "Incorrect total deposit");
        require(_depositAmount > 0, "Deposit must be greater than 0");
        require(_durationDays > 0 && _durationDays <= 365, "Invalid duration");
        
        uint256 socialChallengeId = socialChallengeCounter;
        
        SocialChallenge storage newSocialChallenge = socialChallenges[socialChallengeId];
        newSocialChallenge.id = socialChallengeId;
        newSocialChallenge.participants = _participants;
        newSocialChallenge.depositAmount = _depositAmount;
        newSocialChallenge.wakeUpTime = _wakeUpTime;
        newSocialChallenge.startDate = block.timestamp;
        newSocialChallenge.endDate = block.timestamp + (_durationDays * 1 days);
        newSocialChallenge.completed = false;
        
        for (uint256 i = 0; i < _participants.length; i++) {
            newSocialChallenge.joinedUsers[_participants[i]] = true;
            newSocialChallenge.successDays[_participants[i]] = 0;
        }
        
        socialChallengeCounter++;
        
        emit SocialChallengeCreated(socialChallengeId, _participants, _depositAmount);
        
        return socialChallengeId;
    }
    
    /**
     * @dev Confirm wake-up for social challenge
     */
    function confirmSocialWakeUp(
        uint256 _socialChallengeId,
        address _participant
    ) external onlyOracle {
        SocialChallenge storage socialChallenge = socialChallenges[_socialChallengeId];
        require(socialChallenge.joinedUsers[_participant], "User not in challenge");
        require(!socialChallenge.completed, "Challenge completed");
        
        socialChallenge.successDays[_participant]++;
        
        emit WakeUpConfirmed(_socialChallengeId, _participant, socialChallenge.successDays[_participant], block.timestamp);
    }
    
    /**
     * @dev Finalize social challenge - reward winner
     */
    function finalizeSocialChallenge(uint256 _socialChallengeId) external onlyOracle nonReentrant {
        SocialChallenge storage socialChallenge = socialChallenges[_socialChallengeId];
        require(!socialChallenge.completed, "Already finalized");
        require(block.timestamp >= socialChallenge.endDate, "Challenge not ended");
        
        socialChallenge.completed = true;
        
        // Find winner (most successful days)
        address winner = socialChallenge.participants[0];
        uint256 maxDays = socialChallenge.successDays[winner];
        
        for (uint256 i = 1; i < socialChallenge.participants.length; i++) {
            if (socialChallenge.successDays[socialChallenge.participants[i]] > maxDays) {
                winner = socialChallenge.participants[i];
                maxDays = socialChallenge.successDays[winner];
            }
        }
        
        socialChallenge.winner = winner;
        
        // Transfer all deposits to winner
        uint256 totalReward = socialChallenge.depositAmount * socialChallenge.participants.length;
        
        (bool sent, ) = payable(winner).call{value: totalReward}("");
        require(sent, "Failed to send reward");
        
        emit SocialChallengeCompleted(_socialChallengeId, winner, totalReward);
    }
    
    /**
     * @dev Get user profile
     */
    function getUserProfile(address _user) external view returns (UserProfile memory) {
        return userProfiles[_user];
    }
    
    /**
     * @dev Get challenge details
     */
    function getChallenge(uint256 _challengeId) external view validChallenge(_challengeId) returns (
        address user,
        uint256 depositAmount,
        uint256 wakeUpTime,
        uint256 startDate,
        uint256 endDate,
        ChallengeStatus status,
        uint256 daysCompleted,
        uint256 totalDays,
        bool withdrawn
    ) {
        Challenge storage challenge = challenges[_challengeId];
        return (
            challenge.user,
            challenge.depositAmount,
            challenge.wakeUpTime,
            challenge.startDate,
            challenge.endDate,
            challenge.status,
            challenge.daysCompleted,
            challenge.totalDays,
            challenge.withdrawn
        );
    }
    
    /**
     * @dev Check if user woke up on a specific day
     */
    function getWakeUpStatus(uint256 _challengeId, uint256 _dayIndex) external view validChallenge(_challengeId) returns (bool) {
        return challenges[_challengeId].wokenUpToday[_dayIndex];
    }
    
    /**
     * @dev Get user's active challenges
     */
    function getUserChallenges(address _user) external view returns (uint256[] memory) {
        return userChallenges[_user];
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Emergency withdrawal by owner
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        (bool sent, ) = payable(owner()).call{value: address(this).balance}("");
        require(sent, "Emergency withdrawal failed");
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}
