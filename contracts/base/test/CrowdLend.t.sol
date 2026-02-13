// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "forge-std/Test.sol";
import "../src/CrowdLend.sol";

contract CrowdLendTest is Test {
    CrowdLend public c;
    
    function setUp() public {
        c = new CrowdLend();
    }

    function testDeployment() public {
        assertTrue(address(c) != address(0));
    }
}
