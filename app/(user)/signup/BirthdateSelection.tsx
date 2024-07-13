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

  const calculateAge = (year:number, month:number, day:number) => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day); // month - 1 to adjust for zero-based index
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
  
    // 생일이 지났는지 여부를 확인
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
  
    return age;
  };

  import React, { useState, useEffect, ChangeEvent } from 'react';

  function DateSelector({setUserBirthDate}:{setUserBirthDate:(date:string)=>void}){
    const [years] = useState<number[]>(getYears());
    const [months] = useState<number[]>(getMonths());
    const [days, setDays] = useState<number[]>([]);

    const [selectedYear, setSelectedYear] = useState<number>(years[0]);
    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [selectedDay, setSelectedDay] = useState<number>(1);

    useEffect(() => {
      setDays(getDays(selectedYear, selectedMonth));
    }, [selectedYear, selectedMonth]);

    useEffect(()=>{
        if(!days.some((day)=>day===selectedDay)){
            setSelectedDay(1);
        }
    }, [days])
  
    useEffect(()=>{
        const yyyy:string = selectedYear.toString();
        
        let mm:string = selectedMonth.toString();
        if(mm.length < 2){
            mm = "0" + mm;
        }

        let dd:string = selectedDay.toString();
        if(dd.length < 2){
            dd = "0" + dd;
        }

        const yyyymmdd = yyyy + mm + dd;
        setUserBirthDate(yyyymmdd);

    },[selectedYear, selectedMonth, selectedDay])

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
  
    return (
      <div className="grid grid-cols-3">
        <div className='col-span-1'>
          <select id="year" value={selectedYear} onChange={handleYearChange} className="w-full border-[#f5f2f2] border-2 p-2 rounded-md">
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className='col-span-1'>
          <select id="month" value={selectedMonth} onChange={handleMonthChange} className="w-full border-[#f5f2f2] border-2 p-2 rounded-md">
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div className='col-span-1'>
          <select id="day" value={selectedDay} onChange={handleDayChange} className="w-full border-[#f5f2f2] border-2 p-2 rounded-md">
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        {
            calculateAge(selectedYear, selectedMonth, selectedDay) < 15 ?
            <div className='text-red-500 col-span-3'>
                만 15세 이하는 가입할 수 없습니다.
            </div>
            :
            <div className='text-[#38c54b] col-span-3'>
                <span>{selectedYear}</span>년 <span>{selectedMonth}</span>월 <span>{selectedDay}</span>일
            </div>
        }
      </div>
    );
  };
  
  export default DateSelector;
  