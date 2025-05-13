export const calcPer = (totalValue: number, value: number) => {
  if (totalValue === 0) {
    return 0;
  }
  const percentage = (value / totalValue) * 100;
  return Math.round(percentage);
};
