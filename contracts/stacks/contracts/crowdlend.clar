;; ────────────────────────────────────────
;; CrowdLend v1.0.0
;; Author: solidworkssa
;; License: MIT
;; ────────────────────────────────────────

(define-constant VERSION "1.0.0")

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-NOT-FOUND (err u404))
(define-constant ERR-ALREADY-EXISTS (err u409))
(define-constant ERR-INVALID-INPUT (err u422))

;; CrowdLend Clarity Contract
;; Peer-to-peer micro-lending platform.


(define-map loans
    uint
    {
        borrower: principal,
        amount: uint,
        interest: uint,
        deadline: uint,
        repaid: bool,
        lender: (optional principal)
    }
)
(define-data-var loan-nonce uint u0)

(define-public (request-loan (amount uint) (interest uint) (duration uint))
    (let ((id (var-get loan-nonce)))
        (map-set loans id {
            borrower: tx-sender,
            amount: amount,
            interest: interest,
            deadline: (+ block-height duration),
            repaid: false,
            lender: none
        })
        (var-set loan-nonce (+ id u1))
        (ok id)
    )
)

(define-public (fund-loan (id uint))
    (let ((l (unwrap! (map-get? loans id) (err u404))))
        (asserts! (is-none (get lender l)) (err u403))
        (try! (stx-transfer? (get amount l) tx-sender (get borrower l)))
        (map-set loans id (merge l {lender: (some tx-sender)}))
        (ok true)
    )
)

(define-public (repay-loan (id uint))
    (let ((l (unwrap! (map-get? loans id) (err u404))))
        (asserts! (not (get repaid l)) (err u403))
        (try! (stx-transfer? (+ (get amount l) (get interest l)) tx-sender (unwrap! (get lender l) (err u404))))
        (map-set loans id (merge l {repaid: true}))
        (ok true)
    )
)

