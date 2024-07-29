export function timeDifferenceString(inputTime: Date): string {
  const currentTime = new Date();
  const differenceInSeconds = Math.floor(
    (currentTime.getTime() - inputTime.getTime()) / 1000
  );

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;

  if (differenceInSeconds < minute) {
    return differenceInSeconds + "초 전";
  } else if (differenceInSeconds < hour) {
    const minutes = Math.floor(differenceInSeconds / minute);
    return minutes + "분 전";
  } else if (differenceInSeconds < day) {
    const hours = Math.floor(differenceInSeconds / hour);
    return hours + "시간 전";
  } else if (differenceInSeconds < week) {
    const days = Math.floor(differenceInSeconds / day);
    return days + "일 전";
  } else if (differenceInSeconds < month) {
    const weeks = Math.floor(differenceInSeconds / week);
    return weeks + "주 전";
  } else {
    const months = Math.floor(differenceInSeconds / month);
    return months + "달 전";
  }
}

export const formatTime_mmss = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};