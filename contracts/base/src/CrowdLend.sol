// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title CrowdLend Contract
/// @author solidworkssa
/// @notice Peer-to-peer micro-lending platform.
contract CrowdLend {
    string public constant VERSION = "1.0.0";


    struct Loan {
        address borrower;
        uint256 amount;
        uint256 interest;
        uint256 deadline;
        bool repaid;
        address lender;
    }
    
    Loan[] public loans;
    
    function requestLoan(uint256 _amount, uint256 _interest, uint256 _duration) external {
        loans.push(Loan({
            borrower: msg.sender,
            amount: _amount,
            interest: _interest,
            deadline: block.timestamp + _duration,
            repaid: false,
            lender: address(0)
        }));
    }
    
    function fundLoan(uint256 _id) external payable {
        Loan storage l = loans[_id];
        require(l.lender == address(0), "Funded");
        require(msg.value == l.amount, "Incorrect amount");
        
        l.lender = msg.sender;
        payable(l.borrower).transfer(msg.value);
    }
    
    function repayLoan(uint256 _id) external payable {
        Loan storage l = loans[_id];
        require(!l.repaid, "Repaid");
        require(msg.value == l.amount + l.interest, "Incorrect repayment");
        
        l.repaid = true;
        payable(l.lender).transfer(msg.value);
    }

}
