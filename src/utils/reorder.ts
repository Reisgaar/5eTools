// Reorder helpers for drag-and-drop lists.
//
// The screens display a (possibly campaign-filtered) subset of a store's full array, but we
// persist the full array. `reorderFullBySubset` moves item `from`→`to` within the displayed
// subset and rebuilds the full array, leaving non-displayed items in their original slots.

/** Move an element within an array (returns a new array). */
export function moveItem<T>(arr: T[], from: number, to: number): T[] {
    const next = arr.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
}

/**
 * Apply a from→to move made within `subset` back onto `full`.
 * Positions in `full` occupied by subset items get filled with the reordered subset, in order;
 * everything else stays put.
 */
export function reorderFullBySubset<T>(
    full: T[],
    subset: T[],
    from: number,
    to: number,
    key: (item: T) => string,
): T[] {
    const newSubset = moveItem(subset, from, to);
    const subsetKeys = new Set(subset.map(key));
    let i = 0;
    return full.map(item => (subsetKeys.has(key(item)) ? newSubset[i++] : item));
}
