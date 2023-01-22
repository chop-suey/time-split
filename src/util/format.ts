export function padStart(value: number, maxLength: number): string {
    return value.toString().padStart(maxLength, '0');
}