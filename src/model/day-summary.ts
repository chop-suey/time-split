import type { Duration } from "./duration";

export interface TagSummary {
    totalDuration: Duration;
    ongoing: boolean;
    entries: Summary[];
}

export interface Summary {
    tag: string;
    duration: Duration;
    ongoing: boolean;
}