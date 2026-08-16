const getYears = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i);
  }
  return years;
};

const getMonths = (): number[] => {
  return Array.from({ length: 12 }, (_, i) => i + 1);
};

const getDays = (year: number, month: number): number[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

const calculateAge = (year: number, month: number, day: number) => {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
};

import React, { useState, useEffect, ChangeEvent } from "react";

function DateSelector({
  setUserBirthDate,
}: {
  setUserBirthDate: (date: string) => void;
}) {
  const [years] = useState<number[]>(getYears());
  const [months] = useState<number[]>(getMonths());
  const [days, setDays] = useState<number[]>([]);

  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    setDays(getDays(selectedYear, selectedMonth));
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (!days.some((day) => day === selectedDay)) {
      setSelectedDay(1);
    }
  }, [days]);

  useEffect(() => {
    const yyyy: string = selectedYear.toString();

    let mm: string = selectedMonth.toString();
    if (mm.length < 2) {
      mm = "0" + mm;
    }

    let dd: string = selectedDay.toString();
    if (dd.length < 2) {
      dd = "0" + dd;
    }

    const yyyymmdd = yyyy + mm + dd;
    setUserBirthDate(yyyymmdd);
  }, [selectedYear, selectedMonth, selectedDay]);

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(event.target.value);
    setSelectedYear(year);
  };

  const handleMonthChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(event.target.value);
    setSelectedMonth(month);
  };

  const handleDayChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const day = parseInt(event.target.value);
    setSelectedDay(day);
  };

  const age = calculateAge(selectedYear, selectedMonth, selectedDay);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        <select
          id="year"
          value={selectedYear}
          onChange={handleYearChange}
          className="w-full border border-gray-200 rounded-2xl px-3 py-2.5 bg-gray-50/50 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>

        <select
          id="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="w-full border border-gray-200 rounded-2xl px-3 py-2.5 bg-gray-50/50 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}월
            </option>
          ))}
        </select>

        <select
          id="day"
          value={selectedDay}
          onChange={handleDayChange}
          className="w-full border border-gray-200 rounded-2xl px-3 py-2.5 bg-gray-50/50 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}일
            </option>
          ))}
        </select>
      </div>

      {age < 15 ? (
        <span className="text-[11px] font-bold text-rose-500 mt-0.5">
          만 15세 미만은 가입할 수 없습니다.
        </span>
      ) : (
        <span className="text-[11px] font-bold text-emerald-600 mt-0.5">
          {selectedYear}년 {selectedMonth}월 {selectedDay}일 (만 {age}세)
        </span>
      )}
    </div>
  );
}

export default DateSelector;