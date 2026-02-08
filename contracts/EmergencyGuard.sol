// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EmergencyGuard
 * @dev Provides emergency pause/freeze mechanism for wallet protection
 */
contract EmergencyGuard {
    /// @dev User emergency status
    struct EmergencyStatus {
        bool isFrozen;
        uint256 frozenAt;
        string reason;
    }

    /// @dev Mapping of user addresses to their emergency status
    mapping(address => EmergencyStatus) public emergencyStatus;

    /// @dev Mapping of user to authorized guardians
    mapping(address => mapping(address => bool)) public guardians;

    /// @dev Array of all frozen accounts
    address[] public frozenAccounts;

    /// @dev Events
    event EmergencyActivated(address indexed user, string reason);
    event EmergencyDeactivated(address indexed user);
    event GuardianAdded(address indexed user, address indexed guardian);
    event GuardianRemoved(address indexed user, address indexed guardian);

    /**
     * @dev Check if an address is frozen
     * @param _account The account to check
     * @return Whether the account is frozen
     */
    function isFrozen(address _account) public view returns (bool) {
        return emergencyStatus[_account].isFrozen;
    }

    /**
     * @dev Get the freeze status details
     * @param _account The account to check
     * @return status The emergency status struct
     */
    function getEmergencyStatus(address _account)
        public
        view
        returns (EmergencyStatus memory)
    {
        return emergencyStatus[_account];
    }

    /**
     * @dev User activates emergency mode (freezes their account)
     * @param _reason The reason for emergency activation
     */
    function activateEmergency(string memory _reason) public {
        require(!emergencyStatus[msg.sender].isFrozen, "Already frozen");
        require(bytes(_reason).length > 0, "Reason required");

        emergencyStatus[msg.sender] = EmergencyStatus({
            isFrozen: true,
            frozenAt: block.timestamp,
            reason: _reason
        });

        frozenAccounts.push(msg.sender);

        emit EmergencyActivated(msg.sender, _reason);
    }

    /**
     * @dev User deactivates emergency mode (unfreezes their account)
     */
    function deactivateEmergency() public {
        require(emergencyStatus[msg.sender].isFrozen, "Not frozen");

        emergencyStatus[msg.sender].isFrozen = false;

        emit EmergencyDeactivated(msg.sender);
    }

    /**
     * @dev Add a guardian to help manage emergency status
     * @param _guardian The guardian address
     */
    function addGuardian(address _guardian) public {
        require(_guardian != address(0), "Invalid guardian address");
        require(_guardian != msg.sender, "Cannot be your own guardian");

        guardians[msg.sender][_guardian] = true;

        emit GuardianAdded(msg.sender, _guardian);
    }

    /**
     * @dev Remove a guardian
     * @param _guardian The guardian address
     */
    function removeGuardian(address _guardian) public {
        guardians[msg.sender][_guardian] = false;

        emit GuardianRemoved(msg.sender, _guardian);
    }

    /**
     * @dev Check if an address is a guardian for a user
     * @param _user The user address
     * @param _guardian The potential guardian address
     * @return Whether the address is a guardian
     */
    function isGuardian(address _user, address _guardian)
        public
        view
        returns (bool)
    {
        return guardians[_user][_guardian];
    }

    /**
     * @dev Get all frozen accounts (paginated)
     * @param _offset The offset for pagination
     * @param _limit The limit for pagination
     * @return accounts The frozen accounts
     * @return total The total number of frozen accounts
     */
    function getFrozenAccounts(uint256 _offset, uint256 _limit)
        public
        view
        returns (address[] memory accounts, uint256 total)
    {
        total = frozenAccounts.length;

        if (_offset >= total) {
            return (new address[](0), total);
        }

        uint256 end = _offset + _limit > total ? total : _offset + _limit;
        uint256 resultLength = end - _offset;
        accounts = new address[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            accounts[i] = frozenAccounts[_offset + i];
        }
    }
}
