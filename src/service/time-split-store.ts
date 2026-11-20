import { derived, writable } from "svelte/store";
import type { Readable, Writable } from "svelte/store";
import { Datetime } from "../model/datetime";
import type { Timesplit } from "../model/timesplit";
import type { TimeSplitService } from "./time-split-service";

export class TimeSplitStore {
    private readonly splitsService: TimeSplitService;
    private readonly splitsStore: Writable<Timesplit[]>;
    private readonly editingSplitId: Writable<number | null>;

    constructor(splitsService: TimeSplitService) {
        this.splitsService = splitsService;
        this.splitsStore = writable(this.splitsService.getAll());
        this.editingSplitId = writable(null);
    }

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

    private refreshSplits(): void {
        this.splitsStore.set(this.splitsService.getAll());
    }

    startEditingSplit(split: Timesplit): void {
        this.editingSplitId.update((previous) => previous === null ? split.id : previous);
    }

    stopEditing(): void {
        this.editingSplitId.set(null);
    }

    getEditingSplitId(): Readable<number | null> {
        return this.editingSplitId;
    }

    getSplits(): Readable<Timesplit[]> {
        return this.splitsStore;
    }

    getRecentTags(n?: number): Readable<string[]> {
        return derived(this.splitsStore, splits => this.getRecentTagsFromSplits(splits, n));
    }

    private getRecentTagsFromSplits(splits: Timesplit[], n?: number): string[] {
        return splits
            .map(split => split.tag)
            .reduce((tags, curr) => tags.includes(curr) ? tags : [ ...tags, curr ], [] as string[])
            .slice(0, n);
    }
}
