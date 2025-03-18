// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DMeterMRV {
    // Data structures for environmental monitoring
    struct EnvironmentalData {
        uint256 timestamp;
        string dataType; // e.g., "carbon", "biodiversity", "water"
        string location; // Geolocation data
        uint256 value;
        address reporter;
        bool verified;
        uint256 verificationCount;
        mapping(address => bool) verifiers;
    }
    
    // Events for transparency
    event DataSubmitted(uint256 indexed id, address indexed reporter);
    event DataVerified(uint256 indexed id, address indexed verifier);
    event DataDisputed(uint256 indexed id, address indexed disputer, string reason);
    
    // Storage
    mapping(uint256 => EnvironmentalData) public dataRegistry;
    uint256 public dataCount;
    mapping(address => uint256) public reporterReputation;
    uint256 public constant MIN_VERIFICATIONS = 3;
    
    // Modifiers
    modifier onlyVerifiedData(uint256 id) {
        require(dataRegistry[id].verified, "Data not verified");
        _;
    }
    
    modifier notAlreadyVerified(uint256 id) {
        require(!dataRegistry[id].verifiers[msg.sender], "Already verified");
        _;
    }
    
    // Data submission function
    function submitData(
        string memory dataType,
        string memory location,
        uint256 value
    ) public returns (uint256) {
        uint256 id = dataCount++;
        dataRegistry[id] = EnvironmentalData({
            timestamp: block.timestamp,
            dataType: dataType,
            location: location,
            value: value,
            reporter: msg.sender,
            verified: false,
            verificationCount: 0
        });
        
        emit DataSubmitted(id, msg.sender);
        return id;
    }
    
    // Verification mechanism
    function verifyData(uint256 id) public notAlreadyVerified(id) {
        require(id < dataCount, "Invalid data ID");
        
        EnvironmentalData storage data = dataRegistry[id];
        data.verifiers[msg.sender] = true;
        data.verificationCount++;
        
        emit DataVerified(id, msg.sender);
        
        // Update verification status if enough verifications
        if (data.verificationCount >= MIN_VERIFICATIONS) {
            data.verified = true;
            reporterReputation[data.reporter]++;
        }
    }
    
    // Dispute mechanism
    function disputeData(uint256 id, string memory reason) public {
        require(id < dataCount, "Invalid data ID");
        require(!dataRegistry[id].verified, "Cannot dispute verified data");
        
        emit DataDisputed(id, msg.sender, reason);
    }
    
    // Get data details
    function getData(uint256 id) public view returns (
        uint256 timestamp,
        string memory dataType,
        string memory location,
        uint256 value,
        address reporter,
        bool verified,
        uint256 verificationCount
    ) {
        require(id < dataCount, "Invalid data ID");
        EnvironmentalData storage data = dataRegistry[id];
        
        return (
            data.timestamp,
            data.dataType,
            data.location,
            data.value,
            data.reporter,
            data.verified,
            data.verificationCount
        );
    }
    
    // Get reporter reputation
    function getReporterReputation(address reporter) public view returns (uint256) {
        return reporterReputation[reporter];
    }
} 