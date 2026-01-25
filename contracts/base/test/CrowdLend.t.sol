// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CrowdLend.sol";

contract CrowdLendTest is Test {
    CrowdLend public crowdLend;
    address public lender = address(0x1);
    address public borrower = address(0x2);

    function setUp() public {
        crowdLend = new CrowdLend();
        vm.deal(lender, 100 ether);
        vm.deal(borrower, 100 ether);
    }

    function testCreateLoan() public {
        vm.startPrank(lender);
        uint256 loanId = crowdLend.createLoan{value: 1 ether}(
            1 ether,
            500, // 5% interest
            30 days
        );
        vm.stopPrank();

        CrowdLend.Loan memory loan = crowdLend.getLoan(loanId);
        assertEq(loan.lender, lender);
        assertEq(loan.amount, 1 ether);
        assertEq(loan.interestRate, 500);
        assertFalse(loan.active);
    }

    function testRequestLoan() public {
        vm.prank(lender);
        uint256 loanId = crowdLend.createLoan{value: 1 ether}(
            1 ether,
            500,
            30 days
        );

        uint256 borrowerBalanceBefore = borrower.balance;

        vm.prank(borrower);
        crowdLend.requestLoan(loanId);

        CrowdLend.Loan memory loan = crowdLend.getLoan(loanId);
        assertEq(loan.borrower, borrower);
        assertTrue(loan.active);
        assertEq(borrower.balance, borrowerBalanceBefore + 1 ether);
    }

    function testRepayLoan() public {
        vm.prank(lender);
        uint256 loanId = crowdLend.createLoan{value: 1 ether}(
            1 ether,
            500,
            30 days
        );

        vm.prank(borrower);
        crowdLend.requestLoan(loanId);

        uint256 repaymentAmount = crowdLend.calculateRepayment(loanId);
        uint256 lenderBalanceBefore = lender.balance;

        vm.prank(borrower);
        crowdLend.repayLoan{value: repaymentAmount}(loanId);

        CrowdLend.Loan memory loan = crowdLend.getLoan(loanId);
        assertTrue(loan.repaid);
        assertFalse(loan.active);
        assertEq(lender.balance, lenderBalanceBefore + repaymentAmount);
    }

    function testCalculateRepayment() public {
        vm.prank(lender);
        uint256 loanId = crowdLend.createLoan{value: 1 ether}(
            1 ether,
            500, // 5%
            30 days
        );

        uint256 expected = 1 ether + (1 ether * 500 / 10000);
        assertEq(crowdLend.calculateRepayment(loanId), expected);
    }

    function testFailRequestActiveLoan() public {
        vm.prank(lender);
        uint256 loanId = crowdLend.createLoan{value: 1 ether}(
            1 ether,
            500,
            30 days
        );

        vm.prank(borrower);
        crowdLend.requestLoan(loanId);

        vm.prank(address(0x3));
        crowdLend.requestLoan(loanId); // Should fail
    }

    function testFailRepayUnauthorized() public {
        vm.prank(lender);
        uint256 loanId = crowdLend.createLoan{value: 1 ether}(
            1 ether,
            500,
            30 days
        );

        vm.prank(borrower);
        crowdLend.requestLoan(loanId);

        uint256 repaymentAmount = crowdLend.calculateRepayment(loanId);

        vm.prank(address(0x3));
        crowdLend.repayLoan{value: repaymentAmount}(loanId); // Should fail
    }
}
