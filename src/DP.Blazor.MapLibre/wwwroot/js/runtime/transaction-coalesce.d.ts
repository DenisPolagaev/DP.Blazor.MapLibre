export type Transaction = {
    event: string;
    data?: unknown[] | null;
};
/**
 * Latest-wins for idempotent style/source updates. Add/remove keep original order.
 */
export declare function coalesceTransactions(transactions: Transaction[]): Transaction[];
//# sourceMappingURL=transaction-coalesce.d.ts.map