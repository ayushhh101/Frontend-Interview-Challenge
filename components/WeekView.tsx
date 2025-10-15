/**
 * WeekView Component
 *
 * Displays appointments for a week (Monday - Sunday) in a grid format.
 *
 * TODO for candidates:
 * 1. Generate a 7-day grid (Monday through Sunday)
 * 2. Generate time slots for each day
 * 3. Position appointments in the correct day and time
 * 4. Make it responsive (may need horizontal scroll on mobile)
 * 5. Color-code appointments by type
 * 6. Handle overlapping appointments
 */

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
 * TODO: Implement this component
 *
 * Architecture suggestions:
 * 1. Generate an array of 7 dates (Mon-Sun) from weekStartDate
 * 2. Generate time slots (same as DayView: 8 AM - 6 PM)
 * 3. Create a grid: rows = time slots, columns = days
 * 4. Position appointments in the correct cell (day + time)
 *
 * Consider:
 * - How to make the grid scrollable horizontally on mobile?
 * - How to show day names and dates in headers?
 * - How to handle appointments that span multiple hours?
 * - Should you reuse logic from DayView?
 */
export function WeekView({ appointments, doctor, weekStartDate }: WeekViewProps) {
  /**
   * TODO: Generate array of 7 dates (Monday through Sunday)
   *
   * Starting from weekStartDate, create an array of the next 7 days
   */
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

  const timeSlots: TimeSlot[] = generateDomainTimeSlots({
    date: new Date(weekStartDate),
    startHour: 8,
    endHour: 18,
    slotDurationMinutes: 60 // Use hourly slots for week view
  }).map(slot => ({
    start: slot.start,
    end: slot.end,
    label: format(slot.start, 'h:mm a') // Add the required label property
  }));

  /**
   * TODO: Get appointments for a specific day
   */
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

  /**
   * TODO: Get appointments for a specific day and time slot
   */
  function getAppointmentsForTimeSlot(day: Date, slot: TimeSlot): Appointment[] {
    return appointments.filter((appt) => {
      const start = new Date(appt.startTime);

      // First check if it's the same day
      const isSameDate =
        start.getFullYear() === day.getFullYear() &&
        start.getMonth() === day.getMonth() &&
        start.getDate() === day.getDate();

      // Then check if it starts in this hour slot
      const isInSlot = start.getHours() === slot.start.getHours();

      return isSameDate && isInSlot;
    });
  }

  const weekRange = `${format(weekDays[0], 'MMM d')} - ${format(
    weekDays[6],
    'MMM d, yyyy'
  )}`;

  const typeColors: Record<string, string> = {
    'checkup': 'bg-blue-100 border-blue-400',
    'consultation': 'bg-green-100 border-green-400',
    'follow-up': 'bg-orange-100 border-orange-400',
    'procedure': 'bg-purple-100 border-purple-400'
  };

  return (
    <div className="week-view w-full">
      {/* Week header - Responsive text */}
      <div className="mb-4 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          {weekRange}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-600 mt-1">
            Dr. {doctor.name} - <span className="capitalize">{doctor.specialty.replace('-', ' ')}</span>
          </p>
        )}
      </div>

      {/* Mobile scroll hint - Only show on small screens */}
      <div className="block sm:hidden text-xs text-gray-500 mb-2 text-center bg-gray-50 p-2 rounded">
        ← Scroll horizontally to see all days →
      </div>

      {/* Grid Container - Enhanced responsive scrolling */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
        <div className="min-w-[600px] sm:min-w-[700px] lg:min-w-full">
          <table className="w-full border-collapse">
            {/* Table Header - Responsive cell sizes */}
            <thead>
              <tr className="bg-gray-50">
                <th className="w-12 sm:w-16 md:w-20 p-1 sm:p-2 text-xs border border-gray-200 text-left sticky left-0 z-10 bg-gray-50">
                  Time
                </th>
                {weekDays.map((day, idx) => (
                  <th
                    key={idx}
                    className="p-1 sm:p-2 text-xs border border-gray-200 text-center min-w-[80px] sm:min-w-[100px]"
                  >
                    <div className="font-semibold text-gray-800">
                      {format(day, 'EEE')}
                    </div>
                    <div className="text-gray-600 text-xs">{format(day, 'MMM d')}</div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body - Responsive cell heights */}
            <tbody>
              {timeSlots.map((slot, slotIdx) => (
                <tr key={slotIdx} className="border-t border-gray-200 hover:bg-gray-50">
                  {/* Time column - Sticky and responsive */}
                  <td className="p-1 sm:p-2 text-xs text-gray-600 align-top bg-white sticky left-0 z-10 border border-gray-200">
                    <div className="truncate">
                      {format(slot.start, 'h a')}
                    </div>
                  </td>

                  {/* Day columns - Responsive cell content */}
                  {weekDays.map((day, dayIdx) => {
                    const slotAppointments = getAppointmentsForTimeSlot(day, slot);

                    return (
                      <td
                        key={dayIdx}
                        className="p-0.5 sm:p-1 border border-gray-200 h-[50px] sm:h-[60px] align-top relative"
                      >
                        {slotAppointments.length > 0 ? (
                          slotAppointments.map((appt) => (
                            <div
                              key={appt.id}
                              className={`text-xs p-1 mb-1 rounded-sm border-l-2 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow`}
                              style={{
                                backgroundColor: appt.type === 'consultation' ? '#dcfce7' :
                                  appt.type === 'procedure' ? '#f3e8ff' :
                                    appt.type === 'follow-up' ? '#ffedd5' :
                                      appt.type === 'checkup' ? '#dbeafe' :
                                        '#f3f4f6',
                                borderLeftColor: appt.type === 'consultation' ? '#4ade80' :
                                  appt.type === 'procedure' ? '#c084fc' :
                                    appt.type === 'follow-up' ? '#fb923c' :
                                      appt.type === 'checkup' ? '#60a5fa' :
                                        '#9ca3af'
                              }}
                            >
                              <div className="font-medium truncate text-xs">
                                {format(new Date(appt.startTime), 'h:mm')}
                              </div>
                              <div className="truncate capitalize text-xs">
                                {appt.type}
                              </div>
                            </div>
                          ))
                        ) : (
                          // Empty cell indicator - Responsive dash
                          <div className="flex items-center justify-center h-full w-full">
                            <div className="w-6 sm:w-8 md:w-12 h-[2px] sm:h-[3px] bg-gray-200" aria-label="No appointments"></div>
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

      {/* Empty state - Responsive padding */}
      {appointments.length === 0 && (
        <div className="mt-4 text-center text-gray-500 text-sm py-6 sm:py-8">
          No appointments scheduled for this week
        </div>
      )}
    </div>
  );
}

/**
 * TODO: Consider reusing the AppointmentCard component from DayView
 *
 * You might want to add a "compact" prop to make it smaller for week view
 */
