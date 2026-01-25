import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.5.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "Can create a loan offer",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const lender = accounts.get('wallet_1')!;
        const amount = 1000000; // 1 STX in microSTX
        const interestRate = 500; // 5%
        const duration = 144; // ~1 day in blocks

        let block = chain.mineBlock([
            Tx.contractCall(
                'crowdlend',
                'create-loan',
                [types.uint(amount), types.uint(interestRate), types.uint(duration)],
                lender.address
            )
        ]);

        block.receipts[0].result.expectOk().expectUint(0);

        // Verify loan was created
        let getLoan = chain.callReadOnlyFn(
            'crowdlend',
            'get-loan',
            [types.uint(0)],
            lender.address
        );

        const loanData = getLoan.result.expectOk().expectSome();
        assertEquals(loanData['amount'], types.uint(amount));
    }
});

Clarinet.test({
    name: "Can request an available loan",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const lender = accounts.get('wallet_1')!;
        const borrower = accounts.get('wallet_2')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'crowdlend',
                'create-loan',
                [types.uint(1000000), types.uint(500), types.uint(144)],
                lender.address
            )
        ]);

        const loanId = block.receipts[0].result.expectOk().expectUint(0);

        // Request the loan
        let requestBlock = chain.mineBlock([
            Tx.contractCall(
                'crowdlend',
                'request-loan',
                [types.uint(loanId)],
                borrower.address
            )
        ]);

        requestBlock.receipts[0].result.expectOk().expectBool(true);
    }
});

Clarinet.test({
    name: "Can repay a loan",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const lender = accounts.get('wallet_1')!;
        const borrower = accounts.get('wallet_2')!;
        const amount = 1000000;
        const interestRate = 500;

        let block = chain.mineBlock([
            Tx.contractCall(
                'crowdlend',
                'create-loan',
                [types.uint(amount), types.uint(interestRate), types.uint(144)],
                lender.address
            ),
            Tx.contractCall(
                'crowdlend',
                'request-loan',
                [types.uint(0)],
                borrower.address
            )
        ]);

        // Repay the loan
        let repayBlock = chain.mineBlock([
            Tx.contractCall(
                'crowdlend',
                'repay-loan',
                [types.uint(0)],
                borrower.address
            )
        ]);

        const expectedRepayment = amount + (amount * interestRate / 10000);
        repayBlock.receipts[0].result.expectOk().expectUint(expectedRepayment);
    }
});

Clarinet.test({
    name: "Calculate repayment correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const lender = accounts.get('wallet_1')!;
        const amount = 1000000;
        const interestRate = 500; // 5%

        chain.mineBlock([
            Tx.contractCall(
                'crowdlend',
                'create-loan',
                [types.uint(amount), types.uint(interestRate), types.uint(144)],
                lender.address
            )
        ]);

        let calculation = chain.callReadOnlyFn(
            'crowdlend',
            'calculate-repayment',
            [types.uint(0)],
            lender.address
        );

        const expected = amount + (amount * interestRate / 10000);
        calculation.result.expectOk().expectUint(expected);
    }
});

Clarinet.test({
    name: "Cannot request already active loan",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const lender = accounts.get('wallet_1')!;
        const borrower1 = accounts.get('wallet_2')!;
        const borrower2 = accounts.get('wallet_3')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'crowdlend',
                'create-loan',
                [types.uint(1000000), types.uint(500), types.uint(144)],
                lender.address
            ),
            Tx.contractCall(
                'crowdlend',
                'request-loan',
                [types.uint(0)],
                borrower1.address
            )
        ]);

        // Try to request same loan
        let failBlock = chain.mineBlock([
            Tx.contractCall(
                'crowdlend',
                'request-loan',
                [types.uint(0)],
                borrower2.address
            )
        ]);

        failBlock.receipts[0].result.expectErr().expectUint(102); // ERR-LOAN-ACTIVE
    }
});
