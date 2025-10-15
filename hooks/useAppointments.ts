/**
 * useAppointments Hook
 *
 * This is a custom hook that encapsulates the business logic for fetching
 * and managing appointments. This is the "headless" pattern - separating
 * logic from presentation.
 *
 * TODO for candidates:
 * 1. Implement the hook to fetch appointments based on filters
 * 2. Add loading and error states
 * 3. Consider memoization for performance
 * 4. Think about how to make this reusable for both day and week views
 */

import { useState, useEffect, useMemo } from 'react';
import type { Appointment, Doctor } from '@/types';
import { appointmentService } from '@/services/appointmentService';

/**
 * Hook parameters
 */
interface UseAppointmentsParams {
  doctorId: string;
  date: Date;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook return value
 */
interface UseAppointmentsReturn {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  loading: boolean;
  error: Error | null;
}

/**
 * useAppointments Hook
 *
 * Fetches and manages appointment data for a given doctor and date/date range.
 *
 */
export function useAppointments(params: UseAppointmentsParams): UseAppointmentsReturn {
  const { doctorId, date, startDate, endDate } = params;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const doctor = useMemo(() => {
      try {
      return appointmentService.getDoctorById(doctorId);
    } catch (err) {
    console.error('Error fetching doctor:', err);
      return undefined;
    }
  }, [doctorId]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchAppointments = async () => {
      try {
        let fetchedAppointments: Appointment[] = [];

        // if week view (date range)
        if (startDate && endDate) {
          fetchedAppointments = appointmentService.getAppointmentsByDoctorAndDateRange(
            doctorId,
            startDate,
            endDate
          );
        } else {
          fetchedAppointments = appointmentService.getAppointmentsByDoctorAndDate(
            doctorId,
            date
          );
        }

        fetchedAppointments = appointmentService.sortAppointmentsByTime(fetchedAppointments);
        if (isMounted) setAppointments(fetchedAppointments);
      } catch (err) {
        if (isMounted) setError(err as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAppointments();
    console.log('Fetching appointments for doctor:', doctorId, 'date:', date, 'startDate:', startDate, 'endDate:', endDate);
    return () => {
      isMounted = false; 
    };


  }, [doctorId, date, startDate, endDate]);

  return {
    appointments,
    doctor,
    loading,
    error,
  };
}

/**
 * //TODO: BONUS: Create additional hooks for specific use cases
 *
 * Examples:
 * - useDayViewAppointments(doctorId: string, date: Date)
 * - useWeekViewAppointments(doctorId: string, weekStartDate: Date)
 * - useDoctors() - hook to get all doctors
 */
