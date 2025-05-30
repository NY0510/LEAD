export const formatTime = (minutes: number): string => {
  // 입력 값이 NaN 또는 비정상적인 경우 처리
  if (isNaN(minutes) || minutes === null || minutes === undefined) {
    return '0분';
  }

  if (minutes === 0) {
    return '0분';
  }

  const absMinutes = Math.abs(minutes); // 절댓값을 사용하여 시간 변환
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;

  const hourStr = hours ? `${hours}시간` : '';
  const minStr = mins ? `${mins}분` : '';

  const formattedTime = [hourStr, minStr].filter(Boolean).join(' ').trim();

  return minutes < 0 ? `-${formattedTime}` : formattedTime;
};
