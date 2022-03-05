
export class LocalTime {
    static readonly pattern = '([0-1]?[0-9]|2[0-3])[.:]([0-5][0-9])';

    private static readonly regex = new RegExp(LocalTime.pattern);

    static parse(timeString: string): LocalTime | null {
        const match = timeString.match(LocalTime.pattern);

        return match.length >= 3
            ? new LocalTime(parseInt(match[1]), parseInt(match[2]))
            : null;
    }

    private constructor(public readonly hours: number, public readonly minutes: number) {}
}
