'use client';

import type { Appointment, Doctor, TimeSlot as TimeSlotType } from '@/types';
import { generateTimeSlots, TimeSlot as DomainTimeSlot } from '@/domain/TimeSlot';
import { TimeSlot as TimeSlotRow } from './ui/TimeSlot';
import { format } from 'date-fns';
import { useMemo } from 'react';

interface DayViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  date: Date;
}


export function DayView({ appointments, doctor, date }: DayViewProps) {

  const domainTimeSlots: DomainTimeSlot[] = generateTimeSlots({ 
    date, 
    startHour: 8,
    endHour: 18,
    slotDurationMinutes: 30 
  });
  
  const timeSlots: TimeSlotType[] = domainTimeSlots.map(slot => ({
    start: slot.start,
    end: slot.end,
    label: format(slot.start, 'h:mm a')
  }));

  /**
   *
   * Given a time slot, find all appointments that overlap with it
   */
  function getAppointmentsForSlot(slot: TimeSlotType): Appointment[] {
   return appointments.filter((appt) => {
      const start = new Date(appt.startTime);
      const end = new Date(appt.endTime);
      return (
        (start >= slot.start && start < slot.end) ||  // Starts in this slot
        (end > slot.start && end <= slot.end) ||     // Ends in this slot
        (start <= slot.start && end >= slot.end)     // Spans across this slot
      );
    });
  }

  const showCurrentTime = useMemo(() => {
    const today = new Date();
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    );
  }, [date]);

  const currentTimeOffset = useMemo(() => {
    if (!showCurrentTime) return 0;
    const now = new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(8, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0); 

    if (now < startOfDay) return 0;
    if (now > endOfDay) return (endOfDay.getTime() - startOfDay.getTime()) / (1000 * 60) * 2; // after end

    const minutesSinceStart = (now.getTime() - startOfDay.getTime()) / (1000 * 60);
    return (minutesSinceStart / 30) * 50;
  }, [date, showCurrentTime]);

  return (
   <div className="day-view w-full">
      {/* Day header */}
      <div className="mb-4 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white transition-colors">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors">
            Dr. {doctor.name} - {doctor.specialty}
          </p>
        )}
      </div>

      {/* Timeline  */}
      <div className="relative divide-y divide-gray-100 dark:divide-gray-700 h-[60vh] sm:h-[70vh] lg:max-h-[calc(100vh-300px)] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 transition-colors">
        {showCurrentTime && (
          <div
            className="absolute left-0 right-0 h-1 pointer-events-none z-20"
            style={{ top: `${currentTimeOffset}px` }}
          >
            <div className="w-full h-0.5 bg-red-500 dark:bg-red-400" />
            <span className="hidden sm:inline-block ml-2 text-xs text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 px-1 rounded shadow border border-red-200 dark:border-red-600 transition-colors" 
                  style={{ position: 'absolute', left: 0, top: '-0.75rem' }}>
              Now
            </span>
          </div>
        )}
        {timeSlots.map((slot, i) => (
          <TimeSlotRow
            key={i}
            slot={slot}
            appointments={getAppointmentsForSlot(slot)}
          />
        ))}
      </div>

      {/* Empty state  */}
      {appointments.length === 0 && (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm py-6 sm:py-10 transition-colors">
          No appointments scheduled for this day
        </div>
      )}
    </div>
  );
}

