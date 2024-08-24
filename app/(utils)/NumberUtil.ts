
/**
 * n자리 넘버 반올림
 */
export const roundToNPlaces = (num: number, n: number): number =>{
    const factor = Math.pow(10, n);
    return Math.round(num * factor) / factor;
}