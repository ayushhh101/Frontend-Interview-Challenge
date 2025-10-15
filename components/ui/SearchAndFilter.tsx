'use client';

import { useState } from 'react';
import type { AppointmentType } from '@/types';

interface SearchAndFilterProps {
  searchTerm: string;
  selectedType: AppointmentType | 'all';
  onSearchChange: (term: string) => void;
  onTypeChange: (type: AppointmentType | 'all') => void;
  onClear: () => void;
  appointmentCount: number;
}

const APPOINTMENT_TYPES: { value: AppointmentType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'checkup', label: 'Checkup' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'procedure', label: 'Procedure' },
];

export function SearchAndFilter({
  searchTerm,
  selectedType,
  onSearchChange,
  onTypeChange,
  onClear,
  appointmentCount,
}: SearchAndFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasActiveFilters = searchTerm || selectedType !== 'all';

  return (
    <div className="bg-gray-50 border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as AppointmentType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {APPOINTMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Clear
            </button>
          )}

          {/* Results Count */}
          <div className="hidden sm:block text-sm text-gray-500 ml-2">
            {appointmentCount} {appointmentCount === 1 ? 'appointment' : 'appointments'}
          </div>
        </div>
      </div>

      {/* Mobile Results Count */}
      <div className="block sm:hidden mt-2 text-sm text-gray-500">
        {appointmentCount} {appointmentCount === 1 ? 'appointment' : 'appointments'} found
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Patient: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
              Type: {selectedType}
              <button
                onClick={() => onTypeChange('all')}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:text-green-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}