export class Datetime {
    public static fromDate(date: Date): Datetime {
        return new Datetime(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes()
        )
    }

    public static fromArray([year, month, day, hour, minute]: number[]): Datetime {
        return new Datetime(year, month, day, hour, minute);
    }

    constructor(
        public readonly year: number,
        public readonly month: number,
        public readonly day: number,
        public readonly hour: number,
        public readonly minute: number
    ) {}

    withTime(hours: number, minutes: number): Datetime {
        return new Datetime(this.year, this.month, this.day, hours, minutes);
    }

    getDateText(): string {
        const year = this.padStart(this.year, 4);
        const month = this.padStart(this.month, 2);
        const day = this.padStart(this.day, 2);
        return `${year}-${month}-${day}`;
    }

    getTimeText(): string {
        const hour = this.padStart(this.hour, 2);
        const minute = this.padStart(this.minute, 2);
        return `${hour}:${minute}`;
    }

    asArray(): number[] {
        return [ this.year, this.month, this.day, this.hour, this.minute ];
    }

    toDateUtc(): Date {
        return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute));
    }

    private padStart(value: number, maxLength: number): string {
        return value.toString().padStart(maxLength, '0');
    }
}