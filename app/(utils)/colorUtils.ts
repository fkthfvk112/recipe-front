export const convertStringToRGB = (string: string): string => {
    const substring = string.substring(0, 3);
    const paddedSubstring = substring.padEnd(3, 'c');

    const r = paddedSubstring.charCodeAt(0)%255;
    const g = paddedSubstring.charCodeAt(1)%255;
    const b = paddedSubstring.charCodeAt(2)%255;

    // RGB 코드 생성
    const rgbCode = `rgb(${r}, ${g}, ${b})`;

    return rgbCode;
};