export const calcPer = (totalValue: number, value: number) => {
  if (totalValue === 0) {
    return 0;
  }
  const percentage = (value / totalValue) * 100;
  return Math.round(percentage);
};

export const addSign = (input:number) =>{
    if(input!>=0){
      return `${input}`
    }
    else{
      return `+${input}`
    }
}

export const sumArr = (inputArr:number[]) =>{
  const sum = inputArr.reduce((acc, cur) => acc + cur, 0);
  return sum;
}