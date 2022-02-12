import { derived, Readable, Writable, writable } from "svelte/store";
import type { Timesplit } from "../model/timesplit";

const LOCAL_STORAGE_KEY = 'time-splits';

let nextId = findNextId();

const splitsStore: Writable<Timesplit[]> = writable(getTimeSplitsFromStorage());

splitsStore.subscribe(storeTimeSplits);

const recentTagsStore = derived(splitsStore, splits => getRecentTagsFromSplits(splits, 5));

export const timeSplitService = {
    newSplit(tag: string): void {
        splitsStore.update(splits => [ { id: nextId++, datetime: new Date(), tag }, ...splits ]);
    },

    deleteSplit({ id }: Timesplit): void {
        splitsStore.update(splits => splits.filter(split => split.id !== id));
    },

    getSplits(): Readable<Timesplit[]> {
        return splitsStore;
    },

    getRecentTags(): Readable<string[]> {
        return recentTagsStore;
    }
};

function getTimeSplitsFromStorage(): Timesplit[] {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY);
    return !value 
        ? []
        : parseStoredValue(value);
}

function parseStoredValue(value: string): Timesplit[] {
    const parsed = JSON.parse(value);
    return !Array.isArray(parsed)
        ? []
        : parsed.map(split => ({ id: split[0], datetime: new Date(split[1]), tag: split[2] }));
}

function storeTimeSplits(splits: Timesplit[]): void {
    const value = splits.map(split => [split.id, split.datetime.getTime(), split.tag]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
}


function getRecentTagsFromSplits(splits: Timesplit[], n: number): string[] {
    return splits
        .sort((a, b) => b.datetime.getTime() - a.datetime.getTime())
        .map(split => split.tag)
        .reduce((tags, curr) => tags.includes(curr) ? tags : [ ...tags, curr ], [])
        .slice(0, n);
}

function findNextId(): number {
    return getTimeSplitsFromStorage()
        .reduce((nextId, split) => split.id > nextId ? split.id + 1 : nextId, 0);
}