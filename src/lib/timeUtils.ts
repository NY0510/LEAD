export const formatTime = (minutes: number): string => {
  if (minutes <= 0) {
    return '0분';
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const hourStr = hours ? `${hours}시간` : '';
  const minStr = mins ? `${mins}분` : '';

  return [hourStr, minStr].filter(Boolean).join(' ').trim();
};
