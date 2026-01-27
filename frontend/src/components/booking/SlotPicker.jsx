"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Globe } from "lucide-react";
import {
  getNextDays,
  formatDateISO,
  formatTime,
  isSlotAvailable,
  groupSlotsByDate,
} from "@/lib/booking-utils";
import { cn } from "@/lib/utils";

export function SlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  currentUserId,
  mentor,
  sessionType,
  disabled = false,
}) {
  const [selectedDate, setSelectedDate] = useState(formatDateISO(new Date()));
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Group slots by date
  const slotsByDate = useMemo(() => groupSlotsByDate(slots), [slots]);

  // Get slots for selected date
  const slotsForSelectedDate = useMemo(() => {
    return slotsByDate[selectedDate] || [];
  }, [slotsByDate, selectedDate]);

  // Check if a date has available slots
  const hasAvailableSlots = (dateStr) => {
    const dateSlots = slotsByDate[dateStr] || [];
    return dateSlots.some((slot) => isSlotAvailable(slot, currentUserId));
  };

  // Get calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Start from Sunday of the first week
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days = [];
    const current = new Date(startDate);

    // Generate 6 weeks of days
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    // Don't go before current month
    if (newMonth >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    // Don't go more than 2 months ahead
    const maxMonth = new Date();
    maxMonth.setMonth(maxMonth.getMonth() + 2);
    if (newMonth <= maxMonth) {
      setCurrentMonth(newMonth);
    }
  };

  const isDateInCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isDateSelectable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = formatDateISO(date);
    return date >= today && hasAvailableSlots(dateStr);
  };

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Format selected date with timezone fix
  const selectedDateFormatted = selectedDate
    ? (() => {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    })()
    : "";

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Calendar Section */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Select a Date & Time
        </h2>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-medium text-gray-900">{monthName}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mb-4">
          {/* Week day headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const dateStr = formatDateISO(date);
              const isSelected = selectedDate === dateStr;
              const isCurrentMonth = isDateInCurrentMonth(date);
              const isSelectable = isDateSelectable(date);
              const isToday = formatDateISO(new Date()) === dateStr;
              const hasSlots = slotsByDate[dateStr]?.length > 0;

              return (
                <button
                  key={index}
                  onClick={() => isSelectable && setSelectedDate(dateStr)}
                  disabled={!isSelectable}
                  className={cn(
                    "relative aspect-square flex items-center justify-center text-sm rounded-full transition-all duration-200",
                    isSelected
                      ? "bg-slate-900 text-white font-semibold"
                      : isSelectable
                        ? "text-slate-900 font-medium hover:bg-slate-100" // Selectable dates always look active
                        : isCurrentMonth
                          ? "text-gray-300"
                          : "text-gray-200",
                    isSelectable && !isSelected && "cursor-pointer",
                    !isSelectable && "cursor-default"
                  )}
                >
                  {date.getDate()}
                  {/* Today indicator */}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-900" />
                  )}
                  {/* Available slots indicator (green dot) */}
                  {hasSlots && !isSelected && !isToday && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timezone */}
        <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
          <Globe className="w-4 h-4" />
          <span>India Standard Time (IST)</span>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="lg:w-48 lg:border-l lg:border-gray-100 lg:pl-6">
        {selectedDate && (
          <>
            <div className="mb-4">
              <p className="text-base font-medium text-gray-900">
                {selectedDateFormatted}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-500">available times</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 max-h-[300px] overflow-y-auto pr-1"
              >
                {slotsForSelectedDate.length > 0 ? (
                  slotsForSelectedDate.map((slot) => {
                    const available = isSlotAvailable(slot, currentUserId);
                    const isSelected = selectedSlot?.id === slot.id;

                    if (!available) return null;

                    return (
                      <motion.button
                        key={slot.id}
                        onClick={() => !disabled && onSelectSlot(slot)}
                        whileHover={!disabled ? { scale: 1.02 } : {}}
                        whileTap={!disabled ? { scale: 0.98 } : {}}
                        disabled={disabled}
                        className={cn(
                          "w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 border",
                          disabled
                            ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                            : isSelected
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-900 border-slate-200 hover:border-slate-400"
                        )}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {!isSelected && !disabled && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                          {formatTime(slot.startTime)}
                        </div>
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No slots available</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
