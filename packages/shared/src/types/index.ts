// Proposal Types
export enum VotingMechanism {
    Simple = 0,
    Weighted = 1,
    Quadratic = 2,
}

export enum ProposalStatus {
    Active = 'active',
    Ended = 'ended',
    Cancelled = 'cancelled',
    Executed = 'executed',
}

export interface Proposal {
    id: number;
    creator: string;
    title: string;
    description: string;
    startTime: number;
    endTime: number;
    options: string[];
    status: ProposalStatus;
    totalVotes: number;
    mechanism: VotingMechanism;
    quorum: number;
    quorumReached: boolean;
    voteCounts: Record<number, number>;
}

export interface Vote {
    hasVoted: boolean;
    optionIndex: number;
    weight: number;
    timestamp: number;
}

export interface Delegation {
    delegate: string;
    timestamp: number;
}

// Wallet Types
export interface WalletState {
    address: string | null;
    chainId: number | null;
    isConnected: boolean;
}

export interface TransactionStatus {
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
    confirmations?: number;
    blockNumber?: number;
}

// UI Component Types
export interface ProposalCardProps {
    proposal: Proposal;
    onVote?: (proposalId: number, optionIndex: number) => void;
    onDelegate?: (proposalId: number, delegate: string) => void;
    userVote?: Vote;
}

export interface VoteButtonProps {
    proposalId: number;
    optionIndex: number;
    optionText: string;
    voteCount: number;
    totalVotes: number;
    hasVoted: boolean;
    isSelected: boolean;
    disabled: boolean;
    onClick: () => void;
}

export interface CreateProposalFormData {
    title: string;
    description: string;
    options: string[];
    duration: number;
    mechanism: VotingMechanism;
    quorum: number;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface ProposalListResponse {
    proposals: Proposal[];
    total: number;
    page: number;
    pageSize: number;
}

// Contract Event Types
export interface ProposalCreatedEvent {
    proposalId: number;
    creator: string;
    title: string;
    startTime: number;
    endTime: number;
    mechanism: VotingMechanism;
}

export interface VoteCastEvent {
    proposalId: number;
    voter: string;
    optionIndex: number;
    weight: number;
}

export interface ProposalEndedEvent {
    proposalId: number;
    winningOption: number;
}

export interface ProposalCancelledEvent {
    proposalId: number;
    canceller: string;
}

export interface VoteDelegatedEvent {
    proposalId: number;
    delegator: string;
    delegate: string;
}

// Filter and Sort Types
export type ProposalFilter = 'all' | 'active' | 'ended' | 'my-proposals' | 'my-votes';

export type ProposalSortBy = 'newest' | 'oldest' | 'ending-soon' | 'most-votes';

export interface ProposalFilters {
    status?: ProposalStatus[];
    mechanism?: VotingMechanism[];
    creator?: string;
    search?: string;
}

// Pagination Types
export interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy?: ProposalSortBy;
    filters?: ProposalFilters;
}

// Error Types
export class ContractError extends Error {
    constructor(
        message: string,
        public code?: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ContractError';
    }
}

export class WalletError extends Error {
    constructor(
        message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'WalletError';
    }
}

// Utility Types
export type Address = `0x${string}` | string;

export type Timestamp = number;

export type BlockNumber = number;

export interface ChainConfig {
    chainId: number;
    name: string;
    rpcUrl: string;
    blockExplorer: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
}

// Constants
export const VOTING_MECHANISMS: Record<VotingMechanism, string> = {
    [VotingMechanism.Simple]: 'Simple',
    [VotingMechanism.Weighted]: 'Weighted',
    [VotingMechanism.Quadratic]: 'Quadratic',
};

export const PROPOSAL_STATUSES: Record<ProposalStatus, string> = {
    [ProposalStatus.Active]: 'Active',
    [ProposalStatus.Ended]: 'Ended',
    [ProposalStatus.Cancelled]: 'Cancelled',
    [ProposalStatus.Executed]: 'Executed',
};

// Duration constants (in seconds)
export const DURATIONS = {
    MIN: 3600, // 1 hour
    MAX: 2592000, // 30 days
    DEFAULT: 604800, // 7 days
} as const;

// Chain IDs
export const CHAIN_IDS = {
    BASE_MAINNET: 8453,
    BASE_GOERLI: 84531,
    STACKS_MAINNET: 1,
    STACKS_TESTNET: 2147483648,
} as const;
