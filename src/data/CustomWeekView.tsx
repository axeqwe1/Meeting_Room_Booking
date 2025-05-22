// // CustomWeekView.tsx
// import React from 'react';
// import { NavigateAction, TimeGridProps } from 'react-big-calendar';
// import { addDays, isSunday } from 'date-fns';

// // 🟡 ใช้ internal path
// import TimeGrid from 'react-big-calendar/lib/TimeGrid';

// type TEvent = any;
// type TResource = object;

// const CustomWeekWithoutSunday = (props: TimeGridProps<TEvent, TResource>) => {
//   return <TimeGrid {...props} />;
// };

// // กำหนดช่วงวันที่ไม่รวมวันอาทิตย์
// CustomWeekWithoutSunday.range = (date: Date): Date[] => {
//   const start = date;
//   return [...Array(7)]
//     .map((_, i) => addDays(start, i))
//     .filter(day => !isSunday(day));
// };

// // การเลื่อนไปวันถัดไป
// CustomWeekWithoutSunday.navigate = (date: Date, action: NavigateAction): Date => {
//   if (action === 'PREV') return addDays(date, -7);
//   if (action === 'NEXT') return addDays(date, 7);
//   return date;
// };

// CustomWeekWithoutSunday.title = (date: Date) => {
//   return `Custom Week (no Sunday) starting ${date.toLocaleDateString()}`;
// };

// export default CustomWeekWithoutSunday;
