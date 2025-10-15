/**
 * DayView Component
 *
 * Displays appointments for a single day in a timeline format.
 *
 * TODO for candidates:
 * 1. Generate time slots (8 AM - 6 PM, 30-minute intervals)
 * 2. Position appointments in their correct time slots
 * 3. Handle appointments that span multiple slots
 * 4. Display appointment details (patient, type, duration)
 * 5. Color-code appointments by type
 * 6. Handle overlapping appointments gracefully
 */

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

/**
 * DayView Component
 *
 * Renders a daily timeline view with appointments.
 *
 * TODO: Implement this component
 *
 * Architecture suggestions:
 * 1. Create a helper function to generate time slots
 * 2. Create a TimeSlotRow component for each time slot
 * 3. Create an AppointmentCard component for each appointment
 * 4. Calculate appointment positioning based on start/end times
 *
 * Consider:
 * - How to handle appointments that span multiple 30-min slots?
 * - How to show overlapping appointments?
 * - How to make the timeline scrollable if needed?
 * - How to highlight the current time?
 */
export function DayView({ appointments, doctor, date }: DayViewProps) {
  /**
   *
   * Create an array of TimeSlot objects from 8 AM to 6 PM
   * with 30-minute intervals
   *
   * Hint: You can use a loop or date-fns utilities
   */

  const domainTimeSlots: DomainTimeSlot[] = generateTimeSlots({ 
    date, 
    startHour: 8,
    endHour: 18,
    slotDurationMinutes: 30 
  });
  
  // Convert domain time slots to the format expected by TimeSlotRow
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

  // Calculate current time indicator position if today
  const showCurrentTime = useMemo(() => {
    const today = new Date();
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    );
  }, [date]);

  // Calculate the top offset for the current time line
  const currentTimeOffset = useMemo(() => {
    if (!showCurrentTime) return 0;
    const now = new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(8, 0, 0, 0); // 8:00 AM
    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0); // 6:00 PM

    if (now < startOfDay) return 0;
    if (now > endOfDay) return (endOfDay.getTime() - startOfDay.getTime()) / (1000 * 60) * 2; // after end

    const minutesSinceStart = (now.getTime() - startOfDay.getTime()) / (1000 * 60);
    // Each slot is 30min, each slot row is 50px (from TimeSlot min-h-[50px])
    return (minutesSinceStart / 30) * 50;
  }, [date, showCurrentTime]);

  return (
   <div className="day-view w-full">
      {/* Day header - Responsive text sizes */}
      <div className="mb-4 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-600 mt-1">
            Dr. {doctor.name} - {doctor.specialty}
          </p>
        )}
      </div>

      {/* Timeline - Responsive height and scrolling */}
      <div className="relative divide-y divide-gray-100 h-[60vh] sm:h-[70vh] lg:max-h-[calc(100vh-300px)] overflow-y-auto border border-gray-200 rounded-lg">
        {showCurrentTime && (
          <div
            className="absolute left-0 right-0 h-1 pointer-events-none z-20"
            style={{ top: `${currentTimeOffset}px` }}
          >
            <div className="w-full h-0.5 bg-red-500" />
            <span className="hidden sm:inline-block ml-2 text-xs text-red-600 bg-white px-1 rounded shadow border border-red-200" 
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

      {/* Empty state - Responsive padding */}
      {appointments.length === 0 && (
        <div className="mt-4 text-center text-gray-500 text-sm py-6 sm:py-10">
          No appointments scheduled for this day
        </div>
      )}
    </div>
  );
}

/**
 * TODO: Create an AppointmentCard component
 *
 * This should be a small, reusable component that displays
 * a single appointment with appropriate styling.
 *
 * Consider:
 * - Show patient name
 * - Show appointment type
 * - Show duration
 * - Color-code by appointment type (use APPOINTMENT_TYPE_CONFIG from types)
 * - Make it visually clear when appointments span multiple slots
 */
