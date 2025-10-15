'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Doctor } from '@/types';
import { appointmentService } from '@/services/appointmentService';

interface DoctorSelectorProps {
  selectedDoctorId: string;
  onDoctorChange: (doctorId: string) => void;
  label?: string; // optional label for accessibility
  className?: string;
}

export function DoctorSelector({
  selectedDoctorId,
  onDoctorChange,
  label = 'Select Doctor',
  className = '',
}: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    try {
      const allDoctors = appointmentService.getAllDoctors();
      setDoctors(allDoctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }

  }, []);

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId),
    [doctors, selectedDoctorId]
  );

  if (loading) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        Loading doctors...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div className="doctor-selector">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sr-only md:not-sr-only transition-colors">
        {label}
      </label>

      <select
        value={selectedDoctorId || ''}
        onChange={(e) => onDoctorChange(e.target.value)}
        className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 
                   transition-colors"
        aria-label={label}
      >
        <option value="">-- Select a doctor --</option>

        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            Dr. {doctor.name} — {doctor.specialty.replace('-', ' ')}
          </option>
        ))}
      </select>

      {selectedDoctor && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 hidden md:block transition-colors">
          Viewing schedule for{' '}
          <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors">
            Dr. {selectedDoctor.name}
          </span>{' '}
          ({selectedDoctor.specialty.replace('-', ' ')})
        </div>
      )}
    </div>
  );
}
