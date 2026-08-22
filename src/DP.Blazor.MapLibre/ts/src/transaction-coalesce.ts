export type Transaction = {
    event: string;
    data?: unknown[] | null;
};

function coalesceKey(transaction: Transaction): string | null {
    const data = transaction.data ?? [];
    switch (transaction.event) {
        case 'setSourceData':
        case 'setSourceDataAsJson':
        case 'setSourceTiles':
        case 'setVectorSourceTiles':
        case 'setSourceUrl':
            return `${transaction.event}:${String(data[0] ?? '')}`;
        case 'setPaintProperty':
        case 'setLayoutProperty':
            return `${transaction.event}:${String(data[0] ?? '')}:${String(data[1] ?? '')}`;
        case 'setPaintProperties':
        case 'setLayoutProperties':
        case 'setFilter':
        case 'setLayerZoomRange':
            return `${transaction.event}:${String(data[0] ?? '')}`;
        default:
            return null;
    }
}

/**
 * Latest-wins for idempotent style/source updates. Add/remove keep original order.
 */
export function coalesceTransactions(transactions: Transaction[]): Transaction[] {
    const lastIndex = new Map<string, number>();
    for (let index = 0; index < transactions.length; index++) {
        const transaction = transactions[index];
        if (!transaction) {
            continue;
        }

        const key = coalesceKey(transaction);
        if (key) {
            lastIndex.set(key, index);
        }
    }

    const result: Transaction[] = [];
    for (let index = 0; index < transactions.length; index++) {
        const transaction = transactions[index];
        if (!transaction) {
            continue;
        }

        const key = coalesceKey(transaction);
        if (key && lastIndex.get(key) !== index) {
            continue;
        }

        result.push(transaction);
    }

    return result;
}
