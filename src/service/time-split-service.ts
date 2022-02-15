import { derived, Readable, Writable, writable } from "svelte/store";
import { Datetime } from "../model/datetime";
import type { Timesplit } from "../model/timesplit";

const LOCAL_STORAGE_KEY = 'time-splits';

let nextId = 0;

const splitsStore: Writable<Timesplit[]> = writable(getTimeSplitsFromStorage());

splitsStore.subscribe(storeTimeSplits);

const recentTagsStore = derived(splitsStore, splits => getRecentTagsFromSplits(splits, 5));

export const timeSplitService = {
    newSplit(tag: string): void {
        splitsStore.update(splits => [ { id: nextId++, datetime: Datetime.fromDate(new Date()), tag }, ...splits ]);
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
    const splits = Array.isArray(parsed)
        ? parsed.map((split, index) => ({ id: index, datetime: Datetime.fromArray(split[0]), tag: split[1] }))
        : [];
    nextId = splits.length;
    return splits;
}

function storeTimeSplits(splits: Timesplit[]): void {
    const value = splits.map(split => [split.datetime.asArray(), split.tag]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
}


function getRecentTagsFromSplits(splits: Timesplit[], n: number): string[] {
    return splits
        .sort((a, b) => b.datetime.toDateUtc().getTime() - a.datetime.toDateUtc().getTime())
        .map(split => split.tag)
        .reduce((tags, curr) => tags.includes(curr) ? tags : [ ...tags, curr ], [])
        .slice(0, n);
}
