export class Datetime {
    public static fromArray([year, month, day, hour, minute]: number[]): Datetime {
        const datetime = new Date(Date.UTC(year, month, day, hour, minute));
        return new Datetime(datetime);
    }

    private readonly datetime: Date;

    constructor(date = new Date()) {
        this.datetime = new Date(date);
    }

    withTime(hours: number, minutes: number): Datetime {
        const newDate = new Date(this.datetime);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        return new Datetime(newDate);
    }

    getDateText(): string {
        const year = this.padStart(this.datetime.getFullYear(), 4);
        const month = this.padStart(this.datetime.getMonth() + 1, 2);
        const day = this.padStart(this.datetime.getDate(), 2);
        return `${year}-${month}-${day}`;
    }

    getTimeText(): string {
        const hour = this.padStart(this.datetime.getHours(), 2);
        const minute = this.padStart(this.datetime.getMinutes(), 2);
        return `${hour}:${minute}`;
    }

    asArray(): number[] {
        return [ 
            this.datetime.getUTCFullYear(),
            this.datetime.getUTCMonth(),
            this.datetime.getUTCDate(),
            this.datetime.getUTCHours(),
            this.datetime.getUTCMinutes()
        ];
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

    private padStart(value: number, maxLength: number): string {
        return value.toString().padStart(maxLength, '0');
    }
}