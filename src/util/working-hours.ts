import type { Datetime } from "../model/datetime";
import type { Timesplit } from "../model/timesplit";

export function extractWorkingHours(splits: Timesplit[] | null | undefined, nonWorkTags: Set<string>): string[][] {

    return ([ ...splits ?? []])
        .sort((a, b) => a.start.toTime() - b.start.toTime())
        .reduce((acc: Timesplit[], split, index, arr: Timesplit[]) => {
            if (index < 1) {
                return [ split ]
            }
            const previousSplit = acc[acc.length - 1];
            const isPreviousWork = !nonWorkTags.has(previousSplit.tag);
            const isCurrentWork = !nonWorkTags.has(split.tag)

            return isPreviousWork === isCurrentWork
                ? [ ...acc.slice(0, acc.length - 1), previousSplit.withEnd(getEndForSameDay(split.start, split.end)) ]
                : [ ...acc.slice(0, acc.length - 1), previousSplit.withEnd(split.start), split ];
        }, [])
        .filter(split => !nonWorkTags.has(split.tag))
        .map(split => {
            return split.start.isSameDay(split.end)
                ? [ split.start.getTimeText(), split.end!.getTimeText()]
                : [ split.start.getTimeText() ];
        });
}

function getEndForSameDay(start: Datetime, end?: Datetime): Datetime | undefined {
    return start.getDateText() === end?.getDateText() ? end : undefined;
}
