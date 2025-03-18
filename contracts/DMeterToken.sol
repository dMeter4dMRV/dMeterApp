// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract DMeterToken is ERC20, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");
    
    // Vesting schedule
    struct VestingSchedule {
        uint256 startTime;
        uint256 cliff;
        uint256 duration;
        uint256 totalAmount;
        uint256 releasedAmount;
        bool revoked;
    }
    
    mapping(address => VestingSchedule) public vestingSchedules;
    
    // Events
    event VestingScheduleCreated(address indexed beneficiary, uint256 amount);
    event VestingScheduleRevoked(address indexed beneficiary);
    event TokensReleased(address indexed beneficiary, uint256 amount);
    
    constructor() ERC20("DMeter Token", "DMT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(GOVERNOR_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
    
    function createVestingSchedule(
        address beneficiary,
        uint256 startTime,
        uint256 cliff,
        uint256 duration,
        uint256 amount
    ) public onlyRole(GOVERNOR_ROLE) {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(cliff <= duration, "Cliff must be less than or equal to duration");
        
        vestingSchedules[beneficiary] = VestingSchedule({
            startTime: startTime,
            cliff: cliff,
            duration: duration,
            totalAmount: amount,
            releasedAmount: 0,
            revoked: false
        });
        
        emit VestingScheduleCreated(beneficiary, amount);
    }
    
    function releaseVestedTokens(address beneficiary) public {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(schedule.totalAmount > 0, "No vesting schedule found");
        require(!schedule.revoked, "Vesting schedule revoked");
        
        uint256 releasable = _computeReleasableAmount(schedule);
        require(releasable > 0, "No tokens to release");
        
        schedule.releasedAmount += releasable;
        _transfer(address(this), beneficiary, releasable);
        
        emit TokensReleased(beneficiary, releasable);
    }
    
    function revokeVestingSchedule(address beneficiary) public onlyRole(GOVERNOR_ROLE) {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(schedule.totalAmount > 0, "No vesting schedule found");
        require(!schedule.revoked, "Vesting schedule already revoked");
        
        uint256 unreleased = schedule.totalAmount - schedule.releasedAmount;
        schedule.revoked = true;
        
        if (unreleased > 0) {
            _transfer(address(this), msg.sender, unreleased);
        }
        
        emit VestingScheduleRevoked(beneficiary);
    }
    
    function _computeReleasableAmount(VestingSchedule storage schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.startTime + schedule.cliff) {
            return 0;
        }
        
        if (block.timestamp >= schedule.startTime + schedule.duration) {
            return schedule.totalAmount - schedule.releasedAmount;
        }
        
        uint256 timeFromStart = block.timestamp - schedule.startTime;
        uint256 vestedAmount = (schedule.totalAmount * timeFromStart) / schedule.duration;
        
        return vestedAmount - schedule.releasedAmount;
    }
    
    function pause() public onlyRole(GOVERNOR_ROLE) {
        _pause();
    }
    
    function unpause() public onlyRole(GOVERNOR_ROLE) {
        _unpause();
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
} 