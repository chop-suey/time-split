import { derived, Readable, Writable, writable } from "svelte/store";
import { Datetime } from "../model/datetime";
import { Timesplit } from "../model/timesplit";

const LOCAL_STORAGE_KEY = 'time-splits';

let nextId = 0;

const splitsStore: Writable<Timesplit[]> = writable(getTimeSplitsFromStorage());

splitsStore.subscribe(storeTimeSplits);

const recentTagsStore = derived(splitsStore, splits => getRecentTagsFromSplits(splits, 5));

export const timeSplitService = {
    newSplit(tag: string): void {
        splitsStore.update(splits => [ new Timesplit(nextId++, tag, new Datetime()), ...splits ]);
    },

    deleteSplit({ id }: Timesplit): void {
        splitsStore.update(splits => splits.filter(split => split.id !== id));
    },

    updateSplit(split: Timesplit): void {
        splitsStore.update(splits => {
            const index = splits.findIndex(s => s.id === split.id);
            if (index >= 0) {
                splits[index] = split;
            }
            return splits;
        });
    },

    // TODO splits should be sorted by start datetime even, when a split is edited, or added
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
        ? parsed.map((split, index) => new Timesplit(index, split[1], Datetime.fromArray(split[0])))
        : [];
    nextId = splits.length;
    return splits;
}

function storeTimeSplits(splits: Timesplit[]): void {
    const value = splits.map(split => [split.start.asArray(), split.tag]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
}


function getRecentTagsFromSplits(splits: Timesplit[], n: number): string[] {
    return splits
        .sort((a, b) => b.compare(a))
        .map(split => split.tag)
        .reduce((tags, curr) => tags.includes(curr) ? tags : [ ...tags, curr ], [])
        .slice(0, n);
}
