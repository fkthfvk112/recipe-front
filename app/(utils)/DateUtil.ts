export const extractDate =(dateTimeString:string)=>{
    // 입력이 유효한지 확인 (간단한 형식 검사)
    if (typeof dateTimeString !== 'string' || !dateTimeString.includes('T')) {
      return "";
    }
  
    // 날짜 부분만 추출
    const datePart = dateTimeString.split('T')[0];
    return datePart;
  }

  export const extractDateTime = (dateTimeString:string) => {
    // 입력이 유효한지 확인 (간단한 형식 검사)
    if (typeof dateTimeString !== 'string' || !dateTimeString.includes('T')) {
      return "";
      //throw new Error('유효한 날짜 시간 문자열을 입력해주세요.');
    }
  
    // 날짜와 시간 부분을 추출
    const [datePart, timePart] = dateTimeString.split('T');
    const time = timePart.split(':').slice(0, 2).join(':');
  
    return `${datePart} ${time}`;
  };


  /** nDay뒤의 날짜 출력(yyyy-mm-dd) */
  export const getNDayAfterDateKST = (nDay: number) => {
    const today = new Date();
    
    // 현재 시간의 UTC 시간 값 구하기
    const utc = today.getTime() + (today.getTimezoneOffset() * 60000);

    // 한국 표준시(KST) 시간차는 UTC + 9시간
    const KST_TIME_DIFF = 9 * 60 * 60000;
    const kst = new Date(utc + KST_TIME_DIFF);

    // nDay일 만큼 더하거나 빼기
    kst.setDate(kst.getDate() + nDay);

    // 년, 월, 일 추출 후 형식 맞추기
    const year = kst.getFullYear();
    const month = String(kst.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(kst.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

  export const getNDayAfterBaseDateKST = (baseDate: Date, nDay: number) => {
    if (!(baseDate instanceof Date) || isNaN(baseDate.getTime())) {
        return ""; // 유효하지 않으면 빈 문자열 반환
    }
    // 현재 시간의 UTC 시간 값 구하기
    const utc = baseDate.getTime() + (baseDate.getTimezoneOffset() * 60000);

    // 한국 표준시(KST) 시간차는 UTC + 9시간
    const KST_TIME_DIFF = 9 * 60 * 60000;
    const kst = new Date(utc + KST_TIME_DIFF);

    // nDay일 만큼 더하거나 빼기
    kst.setDate(kst.getDate() + nDay);

    // 년, 월, 일 추출 후 형식 맞추기
    const year = kst.getFullYear();
    const month = String(kst.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(kst.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};