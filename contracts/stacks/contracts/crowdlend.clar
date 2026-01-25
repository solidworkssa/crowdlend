;; CrowdLend - Micro-lending platform

(define-data-var loan-counter uint u0)

(define-map loans uint {
    lender: principal,
    borrower: (optional principal),
    amount: uint,
    interest-rate: uint,
    duration: uint,
    active: bool,
    repaid: bool
})

(define-constant ERR-UNAUTHORIZED (err u101))
(define-constant ERR-NOT-AVAILABLE (err u102))

(define-public (create-loan (amount uint) (interest-rate uint) (duration uint))
    (let ((loan-id (var-get loan-counter)))
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (map-set loans loan-id {
            lender: tx-sender,
            borrower: none,
            amount: amount,
            interest-rate: interest-rate,
            duration: duration,
            active: false,
            repaid: false
        })
        (var-set loan-counter (+ loan-id u1))
        (ok loan-id)))

(define-public (request-loan (loan-id uint))
    (let ((loan (unwrap! (map-get? loans loan-id) ERR-NOT-AVAILABLE)))
        (asserts! (is-none (get borrower loan)) ERR-NOT-AVAILABLE)
        (map-set loans loan-id (merge loan {borrower: (some tx-sender), active: true}))
        (try! (as-contract (stx-transfer? (get amount loan) tx-sender tx-sender)))
        (ok true)))

(define-public (repay-loan (loan-id uint))
    (let (
        (loan (unwrap! (map-get? loans loan-id) ERR-NOT-AVAILABLE))
        (interest (/ (* (get amount loan) (get interest-rate loan)) u10000))
        (total (+ (get amount loan) interest)))
        (asserts! (is-eq (some tx-sender) (get borrower loan)) ERR-UNAUTHORIZED)
        (try! (stx-transfer? total tx-sender (get lender loan)))
        (map-set loans loan-id (merge loan {repaid: true, active: false}))
        (ok total)))

(define-read-only (get-loan (loan-id uint))
    (ok (map-get? loans loan-id)))
