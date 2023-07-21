export class Duration {
    constructor (public readonly minutes: number) {}

    plus(duration: Duration) {
        return new Duration(duration.minutes + this.minutes);
    }

    hasDuration(): boolean {
        return this.minutes > 0;
    }

    toString(): String {
        const hours = Math.floor(this.minutes / 60);
        const minutes = this.minutes % 60;
        return `${hours} h ${minutes} min`;
    }
}
