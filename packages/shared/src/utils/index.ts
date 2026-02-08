import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ProposalStatus, VotingMechanism, DURATIONS } from '../types';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format an Ethereum/Stacks address for display
 */
export function formatAddress(address: string, chars: number = 4): string {
    if (!address) return '';
    if (address.length <= chars * 2) return address;
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a timestamp to a readable date string
 */
export function formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format a duration in seconds to a readable string
 */
export function formatDuration(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.join(' ') || '0m';
}

/**
 * Calculate time remaining until a timestamp
 */
export function getTimeRemaining(endTime: number): {
    total: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
} {
    const now = Math.floor(Date.now() / 1000);
    const total = endTime - now;

    if (total <= 0) {
        return {
            total: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true,
        };
    }

    return {
        total,
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
        isExpired: false,
    };
}

/**
 * Format time remaining as a string
 */
export function formatTimeRemaining(endTime: number): string {
    const { days, hours, minutes, isExpired } = getTimeRemaining(endTime);

    if (isExpired) return 'Ended';

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
}

/**
 * Calculate vote percentage
 */
export function calculateVotePercentage(votes: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Validate proposal title
 */
export function validateTitle(title: string): { valid: boolean; error?: string } {
    if (!title || title.trim().length === 0) {
        return { valid: false, error: 'Title is required' };
    }
    if (title.length > 256) {
        return { valid: false, error: 'Title must be less than 256 characters' };
    }
    return { valid: true };
}

/**
 * Validate proposal description
 */
export function validateDescription(description: string): { valid: boolean; error?: string } {
    if (description.length > 1024) {
        return { valid: false, error: 'Description must be less than 1024 characters' };
    }
    return { valid: true };
}

/**
 * Validate proposal options
 */
export function validateOptions(options: string[]): { valid: boolean; error?: string } {
    if (options.length === 0) {
        return { valid: false, error: 'At least one option is required' };
    }
    if (options.length > 20) {
        return { valid: false, error: 'Maximum 20 options allowed' };
    }
    if (options.some(opt => !opt || opt.trim().length === 0)) {
        return { valid: false, error: 'All options must have text' };
    }
    return { valid: true };
}

/**
 * Validate proposal duration
 */
export function validateDuration(duration: number): { valid: boolean; error?: string } {
    if (duration < DURATIONS.MIN) {
        return { valid: false, error: `Duration must be at least ${formatDuration(DURATIONS.MIN)}` };
    }
    if (duration > DURATIONS.MAX) {
        return { valid: false, error: `Duration must be less than ${formatDuration(DURATIONS.MAX)}` };
    }
    return { valid: true };
}

/**
 * Get proposal status color
 */
export function getStatusColor(status: ProposalStatus): string {
    switch (status) {
        case ProposalStatus.Active:
            return 'text-green-600 bg-green-50 border-green-200';
        case ProposalStatus.Ended:
            return 'text-gray-600 bg-gray-50 border-gray-200';
        case ProposalStatus.Cancelled:
            return 'text-red-600 bg-red-50 border-red-200';
        case ProposalStatus.Executed:
            return 'text-blue-600 bg-blue-50 border-blue-200';
        default:
            return 'text-gray-600 bg-gray-50 border-gray-200';
    }
}

/**
 * Get voting mechanism display name
 */
export function getVotingMechanismName(mechanism: VotingMechanism): string {
    switch (mechanism) {
        case VotingMechanism.Simple:
            return 'Simple (1 address = 1 vote)';
        case VotingMechanism.Weighted:
            return 'Weighted (by token balance)';
        case VotingMechanism.Quadratic:
            return 'Quadratic (diminishing returns)';
        default:
            return 'Unknown';
    }
}

/**
 * Check if an address is valid
 */
export function isValidAddress(address: string): boolean {
    // Ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) return true;
    // Stacks address
    if (/^S[A-Z0-9]{39,40}$/.test(address)) return true;
    return false;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

/**
 * Generate a shareable URL for a proposal
 */
export function getProposalShareUrl(proposalId: number): string {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/proposal/${proposalId}`;
}

/**
 * Format block explorer URL
 */
export function getBlockExplorerUrl(
    chain: 'base' | 'stacks',
    type: 'tx' | 'address' | 'block',
    value: string
): string {
    const baseUrl = chain === 'base'
        ? 'https://basescan.org'
        : 'https://explorer.hiro.so';

    switch (type) {
        case 'tx':
            return chain === 'base'
                ? `${baseUrl}/tx/${value}`
                : `${baseUrl}/txid/${value}?chain=mainnet`;
        case 'address':
            return `${baseUrl}/address/${value}`;
        case 'block':
            return `${baseUrl}/block/${value}`;
        default:
            return baseUrl;
    }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const delay = baseDelay * Math.pow(2, i);
            await sleep(delay);
        }
    }
    throw new Error('Max retries exceeded');
}

/**
 * Parse error message from contract error
 */
export function parseContractError(error: any): string {
    if (typeof error === 'string') return error;

    if (error?.reason) return error.reason;
    if (error?.message) {
        // Extract revert reason from error message
        const match = error.message.match(/reason="([^"]+)"/);
        if (match) return match[1];
        return error.message;
    }

    return 'An unknown error occurred';
}

/**
 * Format wei to ETH
 */
export function formatEther(wei: bigint | string, decimals: number = 4): string {
    const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
    const etherValue = Number(weiValue) / 1e18;
    return etherValue.toFixed(decimals);
}

/**
 * Parse ETH to wei
 */
export function parseEther(ether: string): bigint {
    const [whole, fraction = ''] = ether.split('.');
    const paddedFraction = fraction.padEnd(18, '0').slice(0, 18);
    return BigInt(whole + paddedFraction);
}
