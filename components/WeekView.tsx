'use client';

import type { Appointment, Doctor, TimeSlot } from '@/types';
import { generateTimeSlots as generateDomainTimeSlots } from '@/domain/TimeSlot';
import { format, addDays } from 'date-fns';
import React, { useMemo } from 'react';

interface WeekViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  weekStartDate: Date; // Should be a Monday
}

/**
 * WeekView Component
 *
 * Renders a weekly calendar grid with appointments.
 *
 */
export function WeekView({ appointments, doctor, weekStartDate }: WeekViewProps) {

  const adjustedStartDate = useMemo(() => {
    const date = new Date(weekStartDate);
    const day = date.getDay();
    // If not Monday (1), adjust
    if (day !== 1) {
      const offset = day === 0 ? -6 : 1 - day; // Convert Sunday (0) to -6
      return addDays(date, offset);
    }
    return date;
  }, [weekStartDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      return addDays(adjustedStartDate, i);
    });
  }, [adjustedStartDate]);

  /**
   * Generate hourly time slots for the week view
   * Using 60-minute intervals for better overview
   */
  const timeSlots: TimeSlot[] = generateDomainTimeSlots({
    date: new Date(weekStartDate),
    startHour: 8,
    endHour: 18,
    slotDurationMinutes: 60 
  }).map(slot => ({
    start: slot.start,
    end: slot.end,
    label: format(slot.start, 'h:mm a') 
  }));

  function getAppointmentsForDay(day: Date): Appointment[] {
    return appointments.filter((appt) => {
      const apptDate = new Date(appt.startTime);
      return (
        apptDate.getFullYear() === day.getFullYear() &&
        apptDate.getMonth() === day.getMonth() &&
        apptDate.getDate() === day.getDate()
      );
    });
  }

  function getAppointmentsForTimeSlot(day: Date, slot: TimeSlot): Appointment[] {
    return appointments.filter((appt) => {
      const start = new Date(appt.startTime);

      const isSameDate =
        start.getFullYear() === day.getFullYear() &&
        start.getMonth() === day.getMonth() &&
        start.getDate() === day.getDate();

      const isInSlot = start.getHours() === slot.start.getHours();

      return isSameDate && isInSlot;
    });
  }

  const weekRange = `${format(weekDays[0], 'MMM d')} - ${format(
    weekDays[6],
    'MMM d, yyyy'
  )}`;

  return (
    <div className="week-view w-full">
      {/* Week header */}
      <div className="mb-4 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white transition-colors">
          {weekRange}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors">
            Dr. {doctor.name} - <span className="capitalize">{doctor.specialty.replace('-', ' ')}</span>
          </p>
        )}
      </div>

      {/* Mobile scroll hint  */}
      <div className="block sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-2 text-center bg-gray-50 dark:bg-gray-800 p-2 rounded transition-colors">
        ← Scroll horizontally to see all days →
      </div>

      {/* Grid Container  */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto shadow-sm transition-colors">
        <div className="min-w-[600px] sm:min-w-[700px] lg:min-w-full">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 transition-colors">
                <th className="w-12 sm:w-16 md:w-20 p-1 sm:p-2 text-xs border border-gray-200 dark:border-gray-700 text-left sticky left-0 z-10 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                  Time
                </th>
                {weekDays.map((day, idx) => (
                  <th
                    key={idx}
                    className="p-1 sm:p-2 text-xs border border-gray-200 dark:border-gray-700 text-center min-w-[80px] sm:min-w-[100px] transition-colors"
                  >
                    <div className="font-semibold text-gray-800 dark:text-gray-200 transition-colors">
                      {format(day, 'EEE')}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs transition-colors">{format(day, 'MMM d')}</div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body  */}
            <tbody>
              {timeSlots.map((slot, slotIdx) => (
                <tr key={slotIdx} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {/* Time column  */}
                  <td className="p-1 sm:p-2 text-xs text-gray-600 dark:text-gray-400 align-top bg-white dark:bg-gray-900 sticky left-0 z-10 border border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="truncate">
                      {format(slot.start, 'h a')}
                    </div>
                  </td>

                  {/* Day columns */}
                  {weekDays.map((day, dayIdx) => {
                    const slotAppointments = getAppointmentsForTimeSlot(day, slot);

                    return (
                      <td
                        key={dayIdx}
                        className="p-0.5 sm:p-1 border border-gray-200 dark:border-gray-700 h-[50px] sm:h-[60px] align-top relative bg-white dark:bg-gray-900 transition-colors"
                      >
                        {slotAppointments.length > 0 ? (
                          slotAppointments.map((appt) => (
                            <div
                              key={appt.id}
                              className={`text-xs p-1 mb-1 rounded-sm border-l-2 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow`}
                              style={{
                                backgroundColor: appt.type === 'consultation' ? 
                                  (document.documentElement.classList.contains('dark') ? '#064e3b' : '#dcfce7') :
                                  appt.type === 'procedure' ? 
                                    (document.documentElement.classList.contains('dark') ? '#581c87' : '#f3e8ff') :
                                    appt.type === 'follow-up' ? 
                                      (document.documentElement.classList.contains('dark') ? '#9a3412' : '#ffedd5') :
                                      appt.type === 'checkup' ? 
                                        (document.documentElement.classList.contains('dark') ? '#1e3a8a' : '#dbeafe') :
                                        (document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6'),
                                borderLeftColor: appt.type === 'consultation' ? '#4ade80' :
                                  appt.type === 'procedure' ? '#c084fc' :
                                    appt.type === 'follow-up' ? '#fb923c' :
                                      appt.type === 'checkup' ? '#60a5fa' :
                                        '#9ca3af'
                              }}
                            >
                              <div className="font-medium truncate text-xs text-gray-900 dark:text-gray-100">
                                {format(new Date(appt.startTime), 'h:mm')}
                              </div>
                              <div className="truncate capitalize text-xs text-gray-700 dark:text-gray-300">
                                {appt.type}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <div className="w-6 sm:w-8 md:w-12 h-[2px] sm:h-[3px] bg-gray-200 dark:bg-gray-700 transition-colors" aria-label="No appointments"></div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* empty state */}
      {appointments.length === 0 && (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm py-6 sm:py-8 transition-colors">
          No appointments scheduled for this week
        </div>
      )}
    </div>
  );
}

