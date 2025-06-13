export const formatTime = (minutes: number): string => {
  if (isNaN(minutes) || minutes === null || minutes === undefined) {
    return '0분';
  }

  if (minutes === 0) {
    return '0분';
  }

  const absMinutes = Math.abs(minutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;

  const hourStr = hours ? `${hours}시간` : '';
  const minStr = mins ? `${mins}분` : '';

  const formattedTime = [hourStr, minStr].filter(Boolean).join(' ').trim();

  return minutes < 0 ? `-${formattedTime}` : formattedTime;
};
