export const extractDate =(dateTimeString:string)=>{
    // 입력이 유효한지 확인 (간단한 형식 검사)
    if (typeof dateTimeString !== 'string' || !dateTimeString.includes('T')) {
      throw new Error('유효한 날짜 시간 문자열을 입력해주세요.');
    }
  
    // 날짜 부분만 추출
    const datePart = dateTimeString.split('T')[0];
    return datePart;
  }