import { derived, Readable, writable } from "svelte/store";
import { Datetime } from "../model/datetime";
import { Timesplit } from "../model/timesplit";

const LOCAL_STORAGE_KEY = 'time-splits';

export class TimeSplitService {
    private nextId = 0;

    private readonly splitsStore = writable(this.getTimeSplitsFromStorage());
    private readonly recentTagsStore = derived(this.splitsStore, splits => this.getRecentTagsFromSplits(splits, 5));

    constructor() {
        this.splitsStore.subscribe(splits => this.storeTimeSplits(splits));
    }

    newSplit(tag: string): void {
        this.splitsStore.update(splits => [ new Timesplit(this.nextId++, tag, new Datetime()), ...splits ]);
    }

    deleteSplit({ id }: Timesplit): void {
        this.splitsStore.update(splits => splits.filter(split => split.id !== id));
    }

    updateSplit(split: Timesplit): void {
        this.splitsStore.update(splits => {
            const index = splits.findIndex(s => s.id === split.id);
            if (index >= 0) {
                splits[index] = split;
            }
            return splits;
        });
    }

    // TODO splits should be sorted by start datetime even, when a split is edited, or added
    getSplits(): Readable<Timesplit[]> {
        return this.splitsStore;
    }

    getRawSplits(): [number, string][] {
        const value = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]";
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
            ? parsed : [];
    }

    getRecentTags(): Readable<string[]> {
        return this.recentTagsStore;
    }

    private getTimeSplitsFromStorage(): Timesplit[] {
        return this.parseStoredValue(this.getRawSplits())
    }

    private parseStoredValue(rawSplits: [number, string][]): Timesplit[] {
        const splits = rawSplits.map((split, index) => new Timesplit(index, split[1], Datetime.fromTime(split[0])));
        this.nextId = splits.length;
        return splits;
    }

    private storeTimeSplits(splits: Timesplit[]): void {
        const value = splits.map(split => [split.start.toTime(), split.tag]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    }
    
    
    private getRecentTagsFromSplits(splits: Timesplit[], n: number): string[] {
        return splits
            .sort((a, b) => b.compare(a))
            .map(split => split.tag)
            .reduce((tags, curr) => tags.includes(curr) ? tags : [ ...tags, curr ], [])
            .slice(0, n);
    }
}
