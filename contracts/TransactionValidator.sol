// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TransactionValidator
 * @dev Validates and analyzes transactions for security risks
 */
contract TransactionValidator {
    /// @dev Validation result
    struct ValidationResult {
        bool isValid;
        uint256 riskScore;
        string riskLevel;
        string[] warnings;
        uint256 validatedAt;
    }

    /// @dev Validation history
    mapping(address => ValidationResult[]) public validationHistory;

    /// @dev Suspended accounts (potential threats)
    mapping(address => bool) public suspendedAddresses;

    /// @dev Events
    event TransactionValidated(
        address indexed user,
        address indexed target,
        uint256 riskScore,
        string riskLevel
    );
    event AddressSuspended(address indexed target, string reason);
    event AddressUnsuspended(address indexed target);

    /// @dev Risk levels
    string constant RISK_LEVEL_LOW = "LOW";
    string constant RISK_LEVEL_MEDIUM = "MEDIUM";
    string constant RISK_LEVEL_HIGH = "HIGH";
    string constant RISK_LEVEL_CRITICAL = "CRITICAL";

    /**
     * @dev Validate a transaction
     * @param _target The target address of the transaction
     * @param _value The value being sent
     * @param _data The transaction data
     * @return result The validation result
     */
    function validateTransaction(
        address _target,
        uint256 _value,
        bytes calldata _data
    ) public returns (ValidationResult memory result) {
        uint256 riskScore = 0;
        string[] memory warnings = new string[](5);
        uint256 warningCount = 0;

        // Check if target is suspended
        if (suspendedAddresses[_target]) {
            riskScore += 100;
            warnings[warningCount] = "Target address is suspended";
            warningCount++;
        }

        // Check if target is a contract (basic contract validation)
        if (_target.code.length == 0 && _target != address(0)) {
            // Not a contract, could be an EOA
            // Add minimal risk for EOA transfers
            riskScore += 5;
        }

        // Check for suspicious function selector patterns
        if (_data.length >= 4) {
            bytes4 selector = bytes4(_data[:4]);

            // Check for common dangerous function patterns
            // selfdestruct pattern
            if (selector == 0xfe735e99) {
                riskScore += 50;
                warnings[warningCount] = "Potential selfdestruct function";
                warningCount++;
            }

            // delegatecall pattern
            if (selector == 0xf28c5278) {
                riskScore += 40;
                warnings[warningCount] = "Potential delegatecall function";
                warningCount++;
            }
        }

        // Check value for unusually large transfers
        if (_value > 100 ether) {
            riskScore += 20;
            warnings[warningCount] = "Large value transfer";
            warningCount++;
        }

        // Determine risk level
        string memory riskLevel;
        if (riskScore >= 80) {
            riskLevel = RISK_LEVEL_CRITICAL;
        } else if (riskScore >= 50) {
            riskLevel = RISK_LEVEL_HIGH;
        } else if (riskScore >= 20) {
            riskLevel = RISK_LEVEL_MEDIUM;
        } else {
            riskLevel = RISK_LEVEL_LOW;
        }

        // Build result
        string[] memory finalWarnings = new string[](warningCount);
        for (uint256 i = 0; i < warningCount; i++) {
            finalWarnings[i] = warnings[i];
        }

        result = ValidationResult({
            isValid: riskScore < 80,
            riskScore: riskScore,
            riskLevel: riskLevel,
            warnings: finalWarnings,
            validatedAt: block.timestamp
        });

        // Store validation history
        validationHistory[msg.sender].push(result);

        emit TransactionValidated(msg.sender, _target, riskScore, riskLevel);

        return result;
    }

    /**
     * @dev Get validation history for a user
     * @param _user The user address
     * @param _limit The number of recent validations to return
     * @return The validation history
     */
    function getValidationHistory(address _user, uint256 _limit)
        public
        view
        returns (ValidationResult[] memory)
    {
        ValidationResult[] storage history = validationHistory[_user];
        uint256 count = history.length > _limit ? _limit : history.length;

        ValidationResult[] memory result = new ValidationResult[](count);
        uint256 startIndex = history.length - count;

        for (uint256 i = 0; i < count; i++) {
            result[i] = history[startIndex + i];
        }

        return result;
    }

    /**
     * @dev Suspend a suspicious address
     * @param _address The address to suspend
     * @param _reason The reason for suspension
     */
    function suspendAddress(address _address, string memory _reason) public {
        require(_address != address(0), "Invalid address");
        require(bytes(_reason).length > 0, "Reason required");

        suspendedAddresses[_address] = true;

        emit AddressSuspended(_address, _reason);
    }

    /**
     * @dev Unsuspend an address
     * @param _address The address to unsuspend
     */
    function unsuspendAddress(address _address) public {
        require(_address != address(0), "Invalid address");

        suspendedAddresses[_address] = false;

        emit AddressUnsuspended(_address);
    }

    /**
     * @dev Check if an address is suspended
     * @param _address The address to check
     * @return Whether the address is suspended
     */
    function isSuspended(address _address) public view returns (bool) {
        return suspendedAddresses[_address];
    }
}
