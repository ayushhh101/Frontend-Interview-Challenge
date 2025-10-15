'use client';

import type { Appointment } from '@/types';
import { format } from 'date-fns';
import { getPatientById } from '@/data/mockData';

const TYPE_COLORS: Record<string, string> = {
   consultation: 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-500',
  procedure: 'bg-purple-100 dark:bg-purple-900 border-purple-400 dark:border-purple-500',
  'follow-up': 'bg-orange-100 dark:bg-orange-900 border-orange-400 dark:border-orange-500',
  followup: 'bg-orange-100 dark:bg-orange-900 border-orange-400 dark:border-orange-500',
  checkup: 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-500',
  default: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
};

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  // get the appointment type color
  const colorClass = TYPE_COLORS[appointment.type] || TYPE_COLORS.default;

  const patient = getPatientById(appointment.patientId);
  const patientName = patient ? patient.name : 'Unknown Patient';

  return (
    <div
      className={`border-l-4 rounded-md p-1 sm:p-1.5 md:p-2 shadow-sm ${colorClass} overflow-hidden mb-1 transition-colors`}
    >
      <p className="text-xs sm:text-sm font-semibold truncate text-gray-900 dark:text-gray-100">{patientName}</p>
      <p className="text-xs opacity-75 capitalize text-gray-700 dark:text-gray-300">{appointment.type}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {format(new Date(appointment.startTime), 'h:mm a')} -{' '}
        {format(new Date(appointment.endTime), 'h:mm a')}
      </p>
    </div>
  );
}