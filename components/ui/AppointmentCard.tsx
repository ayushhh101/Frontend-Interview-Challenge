'use client';

import type { Appointment } from '@/types';
import { format } from 'date-fns';
import { getPatientById } from '@/data/mockData';

const TYPE_COLORS: Record<string, string> = {
  consultation: 'bg-green-100 border-green-400',
  procedure: 'bg-purple-100 border-purple-400',
  'follow-up': 'bg-orange-100 border-orange-400',
  followup: 'bg-orange-100 border-orange-400',
  checkup: 'bg-blue-100 border-blue-400',
  default: 'bg-gray-100 border-gray-300',
};

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  // Get the appointment type color
  const colorClass = TYPE_COLORS[appointment.type] || TYPE_COLORS.default;

  // Get the patient information
  const patient = getPatientById(appointment.patientId);
  const patientName = patient ? patient.name : 'Unknown Patient';

  // Calculate duration in minutes
  const duration =
    (new Date(appointment.endTime).getTime() -
      new Date(appointment.startTime).getTime()) /
    (1000 * 60);

  return (
    <div
      className={`border-l-4 rounded-md p-1 sm:p-1.5 md:p-2 shadow-sm ${colorClass} overflow-hidden mb-1`}
    >
      <p className="text-xs sm:text-sm font-semibold truncate">{patientName}</p>
      <p className="text-xs opacity-75 capitalize">{appointment.type}</p>
      <p className="text-xs">
        {format(new Date(appointment.startTime), 'h:mm a')} -{' '}
        {format(new Date(appointment.endTime), 'h:mm a')}
      </p>
    </div>
  );
}