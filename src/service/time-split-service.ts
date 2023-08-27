import type { Datetime } from "../model/datetime";
import type { Timesplit } from "../model/timesplit";

export interface TimeSplitService {
    
    newSplit(start: Datetime, tag: String)

    update(split: Timesplit)
    delete(split: Timesplit)

    /**
     * @returns All timesplits ordered descending by time (latest first).
     */
    getAll(): Timesplit[]
}
