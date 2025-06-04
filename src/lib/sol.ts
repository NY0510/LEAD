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
  // 두 배열의 길이가 다르면 0으로 처리
  if (arr1.length !== arr2.length) {
    return 0;
  }

  const percentageArr = arr1.map((value, index) => {
    // arr2[index]가 0이면 0으로 처리
    if (arr2[index] === 0) return 0;
    return (value / arr2[index]) * 100;
  });

  const filteredArr = percentageArr.filter(value => value !== 0);

  // 필터링된 배열이 비어 있으면 0 반환
  if (filteredArr.length === 0) return 0;

  const sum = filteredArr.reduce((acc, val) => acc + val, 0);

  // 평균이 NaN일 경우 0 반환
  const avg = sum / filteredArr.length;

  // 평균이 NaN인 경우 0 반환
  return isNaN(avg) ? 0 : avg;
};
