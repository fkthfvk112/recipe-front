/**문자열과 글자수 n을 받아서 문자열이 n 이상이면 n까지 자른 후 "..."을 붙인다. */
export const truncateString = (str: string, n: number): string=>{
    if (str.length <= n) {
      return str;
    }
    return str.slice(0, n) + '...';
  }

  /**입력받은 첫 글자가 초성이면 true 아니면 false. */
  export const isChosung = (char: string): boolean => {
    const chosungStart = 0x1100; // 조합용 초성 유니코드 시작
    const chosungEnd = 0x1112;   // 조합용 초성 유니코드 끝
  
    const hangulCompatibilityStart = 0x3131; // 한글 호환 자음 유니코드 시작
    const hangulCompatibilityEnd = 0x314E;   // 한글 호환 자음 유니코드 끝
  
    const charCode = char.charCodeAt(0);
  
    // 조합용 초성 또는 한글 호환 자음 범위에 있는지 확인
    return (
      (charCode >= chosungStart && charCode <= chosungEnd) ||
      (charCode >= hangulCompatibilityStart && charCode <= hangulCompatibilityEnd)
    );
  };
  

  /**입력받은 첫 글자가 중성이면 true 아니면 false. */
  export const isJungsung = (char: string): boolean => {
    const jungsungMap = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ', 'ㅐ', 'ㅒ', 'ㅔ', 'ㅖ'];
    
    return jungsungMap.includes(char);
  };
  

export const containChosingJungsungJongsung = (string:string):boolean=>{
  for(const char of string){
    if(isChosung(char) || isJungsung(char)) return true;
  }

  return false;
}