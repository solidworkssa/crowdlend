// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrowdLend {
    struct Loan {
        address lender;
        address borrower;
        uint256 amount;
        uint256 interestRate;
        uint256 duration;
        uint256 createdAt;
        uint256 dueDate;
        bool active;
        bool repaid;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public loanCounter;

    event LoanCreated(uint256 indexed loanId, address indexed lender, uint256 amount);
    event LoanRequested(uint256 indexed loanId, address indexed borrower);
    event LoanRepaid(uint256 indexed loanId, uint256 totalAmount);

    error InsufficientFunds();
    error LoanNotAvailable();
    error UnauthorizedCaller();

    function createLoan(uint256 amount, uint256 interestRate, uint256 duration) external payable returns (uint256) {
        if (msg.value != amount) revert InsufficientFunds();
        uint256 loanId = loanCounter++;
        loans[loanId] = Loan(msg.sender, address(0), amount, interestRate, duration, block.timestamp, 0, false, false);
        emit LoanCreated(loanId, msg.sender, amount);
        return loanId;
    }

    function requestLoan(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        if (loan.borrower != address(0)) revert LoanNotAvailable();
        loan.borrower = msg.sender;
        loan.active = true;
        loan.dueDate = block.timestamp + loan.duration;
        payable(msg.sender).transfer(loan.amount);
        emit LoanRequested(loanId, msg.sender);
    }

    function repayLoan(uint256 loanId) external payable {
        Loan storage loan = loans[loanId];
        if (msg.sender != loan.borrower) revert UnauthorizedCaller();
        uint256 interest = (loan.amount * loan.interestRate) / 10000;
        uint256 totalAmount = loan.amount + interest;
        if (msg.value != totalAmount) revert InsufficientFunds();
        loan.repaid = true;
        loan.active = false;
        payable(loan.lender).transfer(totalAmount);
        emit LoanRepaid(loanId, totalAmount);
    }

    function getLoan(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }
}
