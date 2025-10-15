'use client';

import type { Appointment, TimeSlot } from '@/types';
import { AppointmentCard } from './AppointmentCard';
import { format } from 'date-fns';

interface TimeSlotProps {
  slot: TimeSlot;
  appointments: Appointment[];
}

export function TimeSlot({ slot, appointments }: TimeSlotProps) {
  const appointmentsInSlot = appointments.filter(appt => {
    const start = new Date(appt.startTime);
    return start.getHours() === slot.start.getHours() && 
           start.getMinutes() === slot.start.getMinutes();
  });

  return (
    <div className="flex border-b border-gray-100 relative min-h-[50px] sm:min-h-[60px]">
      {/* Time label - Responsive width and text size */}
      <div className="w-12 sm:w-16 md:w-20 lg:w-24 text-right pr-2 sm:pr-3 py-2 text-xs sm:text-sm text-gray-500 flex-shrink-0">
        {slot.label}
      </div>

      {/* Slot area - Responsive padding */}
      <div className="flex-1 border-l border-gray-100 relative p-1 sm:p-2">
        {appointmentsInSlot.length > 0 ? (
          <div className="space-y-1">
            {appointmentsInSlot.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        ) : (
          // Empty slot indicator - Responsive size
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-8 sm:w-12 h-[2px] sm:h-[3px] bg-gray-300" aria-label="No appointments"></div>
          </div>
        )}
      </div>
    </div>
  );
}
