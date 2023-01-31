export type Minute = number
export function CalcAverageReadTime(str: string): Minute {
    return Math.floor((str.length / 4.7) / 200) || 1;

}