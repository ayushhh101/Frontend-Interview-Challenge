/**
 * Schedule Page
 *
 * Main page for the appointment scheduler.
 * This is where candidates will implement the calendar views.
 *
 * TODO for candidates:
 * 1. Import and use the ScheduleView component
 * 2. Set up state for selected doctor and date
 * 3. Handle view switching (day/week)
 */

'use client';

import { useState } from 'react';
import { MOCK_DOCTORS } from '@/data/mockData';
import type { CalendarView } from '@/types';
import { ScheduleView } from '@/components/ScheduleView';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';

export default function SchedulePage() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(MOCK_DOCTORS[0].id);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('day');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 md:p-6 lg:p-8 transition-colors relative">
      {/* Dark Mode Toggle in top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <DarkModeToggle />
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-4 sm:mb-6 md:mb-8 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
            Appointment Schedule
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors">
            View and manage doctor appointments
          </p>
        </header>
        
        <ScheduleView
          selectedDoctorId={selectedDoctorId}
          selectedDate={selectedDate}
          view={view}
          onDoctorChange={setSelectedDoctorId}
          onDateChange={setSelectedDate}
          onViewChange={setView}
        />
      </div>
    </main>
  );
}
