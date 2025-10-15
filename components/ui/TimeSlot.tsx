'use client';

import type { Appointment, TimeSlot } from '@/types';
import { AppointmentCard } from './AppointmentCard';

interface TimeSlotProps {
  slot: TimeSlot;
  appointments: Appointment[];
}

export function TimeSlot({ slot, appointments }: TimeSlotProps) {
  // Filter appointments that match this specific time slot
  const appointmentsInSlot = appointments.filter(appt => {
    const start = new Date(appt.startTime);
    return start.getHours() === slot.start.getHours() && 
           start.getMinutes() === slot.start.getMinutes();
  });

  return (
    <div className="flex border-b border-gray-100 dark:border-gray-700 relative min-h-[50px] sm:min-h-[60px] bg-white dark:bg-gray-900 transition-colors">
      {/* time label column - shows the slot time (e.g., "9:00 AM") */}
      <div className="w-12 sm:w-16 md:w-20 lg:w-24 text-right pr-2 sm:pr-3 py-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 transition-colors">
        {slot.label}
      </div>

      {/* appointment area - shows appointments or empty state */}
      <div className="flex-1 border-l border-gray-100 dark:border-gray-700 relative p-1 sm:p-2 transition-colors">
        {appointmentsInSlot.length > 0 ? (
          <div className="space-y-1">
            {appointmentsInSlot.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        ) : (
          // Sshow subtle dash when no appointments
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-8 sm:w-12 h-[2px] sm:h-[3px] bg-gray-300 dark:bg-gray-600 transition-colors" aria-label="No appointments"></div>
          </div>
        )}
      </div>
    </div>
  );
}