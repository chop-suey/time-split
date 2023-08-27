import { derived, writable } from "svelte/store";
import type { Readable } from "svelte/store";
import { Datetime } from "../model/datetime";
import type { Timesplit } from "../model/timesplit";
import type { TimeSplitService } from "./time-split-service";

export class TimeSplitStore {

    private readonly splitsStore = writable(this.splitsService.getAll());
    private readonly recentTagsStore = derived(this.splitsStore, splits => this.getRecentTagsFromSplits(splits, 6));

    constructor(private splitsService: TimeSplitService) {}

    newSplit(tag: string): void {
        this.splitsService.newSplit(new Datetime(), tag);
        this.refreshSplits();
    }

    deleteSplit(split: Timesplit): void {
        this.splitsService.delete(split);
        this.refreshSplits();
    }

    updateSplit(split: Timesplit): void {
        this.splitsService.update(split);
        this.refreshSplits();
    }

    getSplits(): Readable<Timesplit[]> {
        return this.splitsStore;
    }

    getRecentTags(): Readable<string[]> {
        return this.recentTagsStore;
    }

    private refreshSplits() {
        this.splitsStore.set(this.splitsService.getAll());
    }

    private getRecentTagsFromSplits(splits: Timesplit[], n: number): string[] {
        return splits
            // .sort((a, b) => b.compare(a))
            .map(split => split.tag)
            .reduce((tags, curr) => tags.includes(curr) ? tags : [ ...tags, curr ], [] as string[])
            .slice(0, n);
    }
}
