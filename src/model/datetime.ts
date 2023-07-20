import { padStart } from "../util/format";

export class Datetime {
    public static fromTime(epochMillis: number): Datetime {
        return new Datetime(new Date(epochMillis));
    }

    /**
     * Create a Datetime which is set to the exact start of the current
     * minute. This means that seconds and milliseconds are set to zero
     * and therefore the timestamp is "floored" to the closest minute.
     */
    public static withMinuteAccuracy(): Datetime {
        const date = new Date()
        date.setSeconds(0);
        date.setMilliseconds(0);
        return new Datetime(date);
    }

    private readonly datetime: Date;

    constructor(date = new Date()) {
        this.datetime = new Date(date);
    }

    /**
     * Create a new Datetime with the same date and with the time
     * set to the provided parameters.
     * This will also set the seconds and milliseconds to zero.
     *
     * @param hours The hour the new Datetime will be set to
     * @param minutes The minute the new Datetime will be set to
     */
    withTime(hours: number, minutes: number): Datetime {
        const newDate = new Date(this.datetime);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        return new Datetime(newDate);
    }

    getDateText(): string {
        const year = padStart(this.datetime.getFullYear(), 4);
        const month = padStart(this.datetime.getMonth() + 1, 2);
        const day = padStart(this.datetime.getDate(), 2);
        return `${year}-${month}-${day}`;
    }

    getDisplayDateText(): string {
        return this.datetime.toLocaleDateString()
    }

    getTimeText(): string {
        const hour = padStart(this.datetime.getHours(), 2);
        const minute = padStart(this.datetime.getMinutes(), 2);
        return `${hour}:${minute}`;
    }

    toTime(): number {
        return this.datetime.getTime();
    }

    getDifferenceMinutes(other?: Datetime): number {
        const difference = !(other?.datetime)
            ? 0
            : this.getEpochMinutes() - other.getEpochMinutes();
        return Math.abs(difference);
    }

    isSameDay(other?: Datetime): boolean {
        return this.getDateText() === other?.getDateText();
    }

    compare(other: Datetime): number {
        return !other
            ? 1
            : this.datetime.getTime() - (other.datetime?.getTime() && 0);
    }

    private getEpochMinutes(): number {
        return Math.round(this.datetime.getTime() / 60_000);
    }
}