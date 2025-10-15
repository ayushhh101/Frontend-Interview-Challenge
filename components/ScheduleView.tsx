/**
 * ScheduleView Component
 *
 * Main component that orchestrates the schedule display.
 * This component should compose smaller components together.
 *
 * TODO for candidates:
 * 1. Create the component structure (header, controls, calendar)
 * 2. Compose DoctorSelector, DayView, WeekView together
 * 3. Handle view switching (day vs week)
 * 4. Manage state or use the useAppointments hook
 * 5. Think about component composition and reusability
 */

'use client';

import { useMemo, useState } from 'react';
import type { CalendarView } from '@/types';
import { DoctorSelector } from './DoctorSelector';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { SearchAndFilter } from './ui/SearchAndFilter';
import { useAppointments } from '@/hooks/useAppointments';
import { useAppointmentSearch } from '@/hooks/useAppointmentSearch';
import { format, addDays, subDays, endOfWeek, startOfWeek } from 'date-fns';
import { LoadingState, ErrorState } from '@/components/ui/Spinner';

interface ScheduleViewProps {
  selectedDoctorId: string;
  selectedDate: Date;
  view: CalendarView;
  onDoctorChange: (doctorId: string) => void;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
}

export function ScheduleView({
  selectedDoctorId,
  selectedDate,
  view,
  onDoctorChange,
  onDateChange,
  onViewChange,
}: ScheduleViewProps) {
  const weekStartDate = useMemo(() => {
    if (view === 'week') {
      return startOfWeek(selectedDate, { weekStartsOn: 1 });
    }
    return undefined;
  }, [selectedDate, view]);

  const weekEndDate = useMemo(() => {
    if (weekStartDate) {
      return endOfWeek(weekStartDate, { weekStartsOn: 1 });
    }
    return undefined;
  }, [weekStartDate]);
  
  const { appointments, doctor, loading, error } = useAppointments({
    doctorId: selectedDoctorId,
    date: selectedDate,
    startDate: weekStartDate,
    endDate: weekEndDate
  });

  // Add search and filter functionality
  const {
    filteredAppointments,
    searchTerm,
    selectedType,
    setSearchTerm,
    setSelectedType,
    clearFilters,
    hasActiveFilters,
  } = useAppointmentSearch({ appointments });

  const goToPrev = () => {
    onDateChange(
      view === 'day' ? subDays(selectedDate, 1) : subDays(selectedDate, 7)
    );
  };

  const goToNext = () => {
    onDateChange(
      view === 'day' ? addDays(selectedDate, 1) : addDays(selectedDate, 7)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header with doctor info and controls */}
      <div className="border-b border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
          <div className="text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Doctor Schedule</h2>
            {doctor ? (
              <p className="text-sm text-gray-600 mt-1">
                Dr. {doctor.name} — <span className="capitalize">{doctor.specialty}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Select a doctor to view schedule</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 lg:flex-row lg:space-x-4">
            <div className="w-full sm:w-auto">
              <DoctorSelector
                selectedDoctorId={selectedDoctorId}
                onDoctorChange={onDoctorChange}
              />
            </div>

            <div className="flex items-center justify-center space-x-2 sm:justify-start">
              <button
                onClick={goToPrev}
                aria-label="Previous day or week"
                className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 transition flex-shrink-0"
              >
                ← Prev
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-0 text-center sm:text-left">
                {format(selectedDate, view === 'week' ? 'MMM yyyy' : 'MMM d, yyyy')}
              </span>
              <button
                onClick={goToNext}
                aria-label="Next day or week"
                className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 transition flex-shrink-0"
              >
                Next →
              </button>
            </div>

            <div className="flex bg-gray-100 rounded-md overflow-hidden w-full sm:w-auto">
              <button
                className={`flex-1 sm:flex-none px-4 py-2 text-sm ${
                  view === 'day'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onViewChange('day')}
              >
                Day
              </button>
              <button
                className={`flex-1 sm:flex-none px-4 py-2 text-sm ${
                  view === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onViewChange('week')}
              >
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      {!loading && !error && appointments.length > 0 && (
        <SearchAndFilter
          searchTerm={searchTerm}
          selectedType={selectedType}
          onSearchChange={setSearchTerm}
          onTypeChange={setSelectedType}
          onClear={clearFilters}
          appointmentCount={filteredAppointments.length}
        />
      )}

      {/* Calendar View */}
      <div className="p-4 sm:p-6 relative min-h-[400px]">
        {loading ? (
          <LoadingState 
            message={view === 'week' ? 'Loading week schedule...' : 'Loading day schedule...'} 
            size="lg" 
          />
        ) : error ? (
          <ErrorState
            title="Failed to Load Schedule"
            message={error.message || "We couldn't load the appointment schedule. Please try again."}
          />
        ) : !doctor ? (
          <ErrorState
            title="Doctor Not Found"
            message="The selected doctor could not be found. Please select a different doctor."
          />
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments</h3>
            <p className="text-gray-500">
              No appointments are scheduled for {view === 'week' ? 'this week' : 'this day'}.
            </p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Appointments</h3>
            <p className="text-gray-500 mb-4">
              No appointments match your current search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {view === 'day' ? (
              <DayView
                appointments={filteredAppointments}
                doctor={doctor}
                date={selectedDate}
              />
            ) : (
              <WeekView
                appointments={filteredAppointments}
                doctor={doctor}
                weekStartDate={weekStartDate || selectedDate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}