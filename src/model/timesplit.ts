import { Datetime } from "./datetime";

export class Timesplit {
    constructor(
        public readonly id: number,
        public readonly tag: string,
        public readonly start: Datetime,
        public readonly end?: Datetime
    ) {}

    withStart(start: Datetime): Timesplit {
        return new Timesplit(this.id, this.tag, start, this.end);
    }

    withEnd(end?: Datetime): Timesplit {
        return new Timesplit(this.id, this.tag, this.start, end);
    }

    withTag(tag: string): Timesplit {
        return new Timesplit(this.id, tag, this.start, this.end);
    }

    getDurationMinutes(sameDayOnly = true): number {
        return sameDayOnly && !this.start?.isSameDay(this.end)
            ? 0
            : this.start?.getDifferenceMinutes(this.end) ?? 0;
    }

    getDurationHoursOngoing(sameDayOnly = true): number {
        const time = new Datetime();

        if (!!this.end || (sameDayOnly && !time.isSameDay(this.start))) {
            return null;
        }

        return this.start.getDifferenceMinutes(time) / 60;
    }

    compare(other: Timesplit): number {
        const compareTime = this.start.compare(other?.start);
        return !compareTime 
            ? this.tag.localeCompare(other?.tag) || (this.id - (other?.id ?? 0))
            : compareTime;
    }
}
