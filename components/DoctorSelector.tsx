/**
 * DoctorSelector Component
 *
 * Dropdown to select which doctor's schedule to view.
 * For front desk staff (can see all doctors).
 *
 * TODO for candidates:
 * 1. Fetch list of all doctors
 * 2. Display in a dropdown/select
 * 3. Show doctor name and specialty
 * 4. Handle selection change
 * 5. Consider using a custom dropdown or native select
 */

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

/**
 * DoctorSelector Component
 *
 * A dropdown to select a doctor from the list of available doctors.
 *
 * TODO: Implement this component
 *
 * Consider:
 * - Should you fetch doctors here or accept them as props?
 * - Native <select> or custom dropdown component?
 * - How to display doctor info (name + specialty)?
 * - Should this be a reusable component?
 */
export function DoctorSelector({
  selectedDoctorId,
  onDoctorChange,
  label = 'Select Doctor',
  className = '',
}: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  // TODO: Fetch doctors
  useEffect(() => {
    // Option 1: Use appointmentService to get doctors
    // const allDoctors = appointmentService.getAllDoctors();
    // setDoctors(allDoctors);

    try {
      const allDoctors = appointmentService.getAllDoctors();
      setDoctors(allDoctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }

    console.log('TODO: Fetch doctors');
  }, []);

  // Find currently selected doctor for display
  // const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // memoized selected doctor
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
     <label className="block text-sm font-medium text-gray-700 mb-1 sr-only md:not-sr-only">
        {label}
      </label>

       <select
        value={selectedDoctorId || ''}
        onChange={(e) => onDoctorChange(e.target.value)}
        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                   bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
        <div className="mt-2 text-sm text-gray-600 hidden md:block">
          Viewing schedule for{' '}
          <span className="font-medium text-gray-800">
            Dr. {selectedDoctor.name}
          </span>{' '}
          ({selectedDoctor.specialty.replace('-', ' ')})
        </div>
      )}
    </div>
  );
}
