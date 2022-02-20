import type { Datetime } from "./datetime";
import type { Timesplit } from "./timesplit";

export interface SplitGroup {
    date: Datetime;
    splits: Timesplit[];
}