import { createContext, useState, useContext } from "react";
import Assist from "../classes/assist";
// 1. Create context
const PeriodContext = createContext();

// 2. Create provider
export function PeriodProvider({ children}) {
   const [period, setPeriod] = useState(() => {
     const periodDate = new Date();
     const periodId = `${periodDate.getFullYear()}${periodDate.getMonth() + 1}`;
     return periodId;
   });
   const [periodData, setPeriodData] = useState(() => {
     const items= [];
     const years = [2025, 2026];
 
     years.forEach((year) => {
       for (let i = 1; i <= 12; i++) {
         items.push({
           text: `${Assist.getMonthName(i)} ${year}`,
           value: `${year}${i}`,
         });
       }
     });
 
     return items;
   });

  const updateSelectedPeriod = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <PeriodContext.Provider value={{ period, periodData, updateSelectedPeriod }}>
      {children}
    </PeriodContext.Provider>
  );
}

// 3. Create a custom hook (cleaner usage)
export function usePeriod() {
  return useContext(PeriodContext);
}
