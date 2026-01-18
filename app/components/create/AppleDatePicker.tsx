"use client";

import { useState, useRef, useEffect } from "react";

interface AppleDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

const months = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export default function AppleDatePicker({ value, onChange, label, placeholder = "Tarih seçin" }: AppleDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDay(date.getDate());
      setSelectedMonth(date.getMonth());
      setSelectedYear(date.getFullYear());
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateString);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const formatDisplayDate = () => {
    if (!value) return placeholder;
    const date = new Date(value);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const years = Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[48px] w-full items-center justify-between rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] transition-all hover:border-[#86868b] focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
      >
        <span className={value ? "text-[#1d1d1f]" : "text-[#6e6e73]"}>
          {formatDisplayDate()}
        </span>
        <svg className="h-5 w-5 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[320px] overflow-hidden rounded-2xl border border-[#d2d2d7] bg-white shadow-lg">
          <div className="border-b border-[#d2d2d7] p-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#0071e3] transition-colors hover:bg-[#f5f5f7]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="appearance-none bg-transparent text-[17px] font-semibold text-[#1d1d1f] focus:outline-none"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
                
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="appearance-none bg-transparent text-[17px] font-semibold text-[#1d1d1f] focus:outline-none"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#0071e3] transition-colors hover:bg-[#f5f5f7]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-2 grid grid-cols-7 gap-1">
              {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"].map((day) => (
                <div key={day} className="flex h-8 items-center justify-center text-[12px] font-medium text-[#6e6e73]">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="h-10" />
              ))}
              
              {days.map((day) => {
                const isSelected = selectedDay === day && 
                  value && 
                  new Date(value).getMonth() === selectedMonth && 
                  new Date(value).getFullYear() === selectedYear;
                
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`flex h-10 items-center justify-center rounded-full text-[15px] transition-all ${
                      isSelected
                        ? "bg-[#0071e3] font-semibold text-white"
                        : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {value && (
            <div className="border-t border-[#d2d2d7] p-3">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setSelectedDay(null);
                  setIsOpen(false);
                }}
                className="w-full rounded-lg py-2 text-[14px] font-medium text-[#ff3b30] transition-colors hover:bg-red-50"
              >
                Tarihi Temizle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
