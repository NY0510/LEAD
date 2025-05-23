import {getStudyByDateRange} from '@/api';
import { useState } from 'react';
const today = new Date();
const [startDate, setStartDate] = useState(today.getDate() - today.getDay() + 1);
const [endDate, setEndDate] = useState(today.getDate() - today.getDay() + 7);
export const getWeekData(uid:number,week:number) => {
    return 0;
}
//WeekTotalSum
//WeekTrueStudySum
//WeekNonStudySum