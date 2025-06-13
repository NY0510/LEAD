export const calcPer = (totalValue: number, value: number) => {
  if (totalValue === 0) {
    return 0;
  }
  const percentage = (value / totalValue) * 100;
  return Math.round(percentage);
};

export const addSign = (input: number) => {
  if (input <= 0) {
    return `${input}`;
  } else {
    return `+${input}`;
  }
};

export const sumArr = (inputArr: number[]) => {
  const sum = inputArr.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

export const calcAvgPer = (arr1: number[], arr2: number[]): number => {
  if (arr1.length !== arr2.length) {
    return 0;
  }

  const percentageArr = arr1.map((value, index) => {
    if (arr2[index] === 0) return 0;
    return (value / arr2[index]) * 100;
  });

  const filteredArr = percentageArr.filter(value => value !== 0);

  if (filteredArr.length === 0) return 0;

  const sum = filteredArr.reduce((acc, val) => acc + val, 0);
  const avg = Math.round(sum / filteredArr.length);
  return isNaN(avg) ? 0 : avg;
};
