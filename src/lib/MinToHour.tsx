export const formatTime = (minutes: number): string => {
  if (minutes === 0) {
    return '';
  }

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}시간`;
    }
    return `${hours}시간 ${remainingMinutes}분`;
  } else {
    return `${minutes}분`;
  }
};
