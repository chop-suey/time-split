import { Datetime } from "../model/datetime";
import { Timesplit } from "../model/timesplit";
import type { TimeSplitService } from "./time-split-service";

const LOCAL_STORAGE_KEY = 'time-splits';

let nextId = 0;
let splits: Timesplit[] = undefined

export class LocalStorageTimeSplitService implements TimeSplitService {
    constructor() {
        if (splits === undefined) {
            this.loadTimeSplits();
        }
    }

    newSplit(start: Datetime, tag: string) {
        const split = new Timesplit(nextId++, tag, start);
        splits = [ split, ...splits ];
        this.sortMatchAndStoreSplits()
    }

    update(split: Timesplit) {
        const index = splits.findIndex(({ id }) => id === split.id);
        if (index >= 0) {
            splits[index] = split;
            this.sortMatchAndStoreSplits();
        }
    }

    delete(split: Timesplit) {
        splits = splits.filter(({ id }) => split.id !== id);
        this.sortMatchAndStoreSplits();
    }

    getAll(): Timesplit[] {
        return [ ...splits ];
    }

    private sortMatchAndStoreSplits() {
        this.sortAndMatchAdjacentSplits();
        const value = splits.map(({ start, tag }) => [start.toTime(), tag]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    }

    private loadTimeSplits(): void {
        splits = this.parseRawSplits(this.getRawSplits());
        this.sortAndMatchAdjacentSplits();
    }

    private getRawSplits(): [number, string][] {
        const value = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]";
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
            ? parsed : [];
    }

    private parseRawSplits(rawSplits: [number, string][]): Timesplit[] {
        const splits = rawSplits.map((split, id) => {
            const time = split[0];
            const tag = split[1];
            return new Timesplit(id, tag, Datetime.fromTime(time));
        });
        nextId = splits.length;
        return splits;
    }

    /**
     * Sort the splits descending by time and update the end time for each split.
     */
    private sortAndMatchAdjacentSplits() {
        this.sortSplits()
        splits = splits.reduceRight((acc, split, index, arr) => {
            const matchedSplit = index > 0
                ? split.withEnd(arr[index - 1].start)
                : split.withEnd(null);
            return [ matchedSplit, ...acc ];
        }, []);
    }

    /**
     * Sort splits descending by time.
     */
    private sortSplits() {
        splits.sort((a, b) => b.compare(a));
    }
}