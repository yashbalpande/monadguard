// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ApprovalManager
 * @dev Manages and revokes token approvals to prevent exploitation
 */
contract ApprovalManager {
    /// @dev Token approval info
    struct TokenApproval {
        address token;
        address spender;
        uint256 amount;
        uint256 approvedAt;
        bool isActive;
    }

    /// @dev User's approvals mapping
    mapping(address => TokenApproval[]) public userApprovals;

    /// @dev Events
    event ApprovalTracked(
        address indexed user,
        address indexed token,
        address indexed spender,
        uint256 amount
    );
    event ApprovalRevoked(
        address indexed user,
        address indexed token,
        address indexed spender
    );

    /**
     * @dev Track a new token approval
     * @param _token The token address
     * @param _spender The spender address
     * @param _amount The approval amount
     */
    function trackApproval(
        address _token,
        address _spender,
        uint256 _amount
    ) public {
        require(_token != address(0), "Invalid token");
        require(_spender != address(0), "Invalid spender");

        TokenApproval memory approval = TokenApproval({
            token: _token,
            spender: _spender,
            amount: _amount,
            approvedAt: block.timestamp,
            isActive: true
        });

        userApprovals[msg.sender].push(approval);

        emit ApprovalTracked(msg.sender, _token, _spender, _amount);
    }

    /**
     * @dev Revoke a token approval
     * @param _token The token address
     * @param _spender The spender address
     */
    function revokeApproval(address _token, address _spender) public {
        require(_token != address(0), "Invalid token");
        require(_spender != address(0), "Invalid spender");

        TokenApproval[] storage approvals = userApprovals[msg.sender];

        for (uint256 i = 0; i < approvals.length; i++) {
            if (
                approvals[i].token == _token &&
                approvals[i].spender == _spender &&
                approvals[i].isActive
            ) {
                // Set to inactive instead of deleting
                approvals[i].isActive = false;

                // Revoke on the actual ERC20 token
                IERC20(_token).approve(_spender, 0);

                emit ApprovalRevoked(msg.sender, _token, _spender);
                return;
            }
        }

        revert("Approval not found");
    }

    /**
     * @dev Get all active approvals for a user
     * @param _user The user address
     * @return Active approvals
     */
    function getUserApprovals(address _user)
        public
        view
        returns (TokenApproval[] memory)
    {
        TokenApproval[] storage allApprovals = userApprovals[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < allApprovals.length; i++) {
            if (allApprovals[i].isActive) {
                activeCount++;
            }
        }

        TokenApproval[] memory activeApprovals = new TokenApproval[](
            activeCount
        );
        uint256 index = 0;

        for (uint256 i = 0; i < allApprovals.length; i++) {
            if (allApprovals[i].isActive) {
                activeApprovals[index] = allApprovals[i];
                index++;
            }
        }

        return activeApprovals;
    }

    /**
     * @dev Get approval count for a user
     * @param _user The user address
     * @return The number of active approvals
     */
    function getApprovalCount(address _user) public view returns (uint256) {
        TokenApproval[] storage allApprovals = userApprovals[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < allApprovals.length; i++) {
            if (allApprovals[i].isActive) {
                activeCount++;
            }
        }

        return activeCount;
    }

    /**
     * @dev Check if a specific approval exists for a user
     * @param _user The user address
     * @param _token The token address
     * @param _spender The spender address
     * @return Whether the approval exists and is active
     */
    function hasApproval(
        address _user,
        address _token,
        address _spender
    ) public view returns (bool) {
        TokenApproval[] storage approvals = userApprovals[_user];

        for (uint256 i = 0; i < approvals.length; i++) {
            if (
                approvals[i].token == _token &&
                approvals[i].spender == _spender &&
                approvals[i].isActive
            ) {
                return true;
            }
        }

        return false;
    }
}
