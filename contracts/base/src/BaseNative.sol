// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BaseNative
 * @notice Helper contract for Base L2 native functionality
 * @dev Implements context for meta-transactions and common L2 patterns
 */
abstract contract BaseNative {
    // Trusted forwarder for gasless transactions (e.g. Gelato, Biconomy)
    address public trustedForwarder;

    event TrustedForwarderUpdated(address indexed oldForwarder, address indexed newForwarder);

    modifier onlyTrustedForwarder() {
        require(msg.sender == trustedForwarder, "Caller is not trusted forwarder");
        _;
    }

    function _msgSender() internal view virtual returns (address sender) {
        if (msg.sender == trustedForwarder) {
            // The first 20 bytes of calldata is the original sender
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return msg.sender;
        }
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        if (msg.sender == trustedForwarder) {
            return msg.data[:msg.data.length - 20];
        } else {
            return msg.data;
        }
    }
}
