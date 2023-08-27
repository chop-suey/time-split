import type { Datetime } from "../model/datetime";
import type { Timesplit } from "../model/timesplit";

export interface TimeSplitService {
    
    newSplit(start: Datetime, tag: String): void

    update(split: Timesplit): void
    delete(split: Timesplit): void

    /**
     * @returns All timesplits ordered descending by time (latest first).
     */
    getAll(): Timesplit[]
}
