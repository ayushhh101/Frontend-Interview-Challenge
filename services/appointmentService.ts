/**
 * Appointment Service
 *
 * This service provides an abstraction layer for accessing appointment data.
 * It's your data access layer - implement the methods to fetch and filter appointments.
 *
 * TODO for candidates:
 * 1. Implement getAppointmentsByDoctor
 * 2. Implement getAppointmentsByDoctorAndDate
 * 3. Implement getAppointmentsByDoctorAndDateRange (for week view)
 * 4. Consider adding helper methods for filtering, sorting, etc.
 * 5. Think about how to structure this for testability
 */

import type { Appointment, Doctor, Patient, PopulatedAppointment } from '@/types';
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_PATIENTS,
  getDoctorById,
  getPatientById,
} from '@/data/mockData';

/**
 * AppointmentService class
 *
 * Provides methods to access and manipulate appointment data.
 * This is where you abstract data access from your components.
 */
export class AppointmentService {

  /**
   * Helper — compare two dates ignoring time
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Helper — check if date is between two dates 
   */
  private isWithinRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  }

  /**
   * Get all appointments for a specific doctor
   */
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return MOCK_APPOINTMENTS.filter((apt) => apt.doctorId === doctorId);
  }

  private validateDate(date: Date, paramName: string): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error(`Invalid ${paramName}: ${date}`);
    }
  }

  /**
   * Enhanced error handling for doctor ID
   */
  private validateDoctorId(doctorId: string): void {
    if (!doctorId || typeof doctorId !== 'string') {
      throw new Error('Please select a Doctor');
    }
  }

  /**
   * Get appointments for a specific doctor on a specific date
   *
   * @param doctorId - The doctor's ID
   * @param date - The date to filter by
   * @returns Array of appointments for that doctor on that date
   */
  getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    this.validateDoctorId(doctorId);
      this.validateDate(date, 'date');

      const doctor = this.getDoctorById(doctorId);
      if (!doctor) {
        throw new Error(`Doctor with ID "${doctorId}" not found`);
      }

    return MOCK_APPOINTMENTS.filter(
      (apt) =>
        apt.doctorId === doctorId &&
        this.isSameDay(new Date(apt.startTime), date)
    );
  }

  /**
   * Get appointments for a specific doctor within a date range (for week view)
   *
   * @param doctorId - The doctor's ID
   * @param startDate - Start of the date range
   * @param endDate - End of the date range
   * @returns Array of appointments within the date range
   */
  getAppointmentsByDoctorAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): Appointment[] {
   try {
      this.validateDoctorId(doctorId);
      this.validateDate(startDate, 'startDate');
      this.validateDate(endDate, 'endDate');

      if (startDate > endDate) {
        throw new Error('Start date cannot be after end date');
      }

      const doctor = this.getDoctorById(doctorId);
      if (!doctor) {
        throw new Error(`Doctor with ID "${doctorId}" not found`);
      }

      return MOCK_APPOINTMENTS.filter(
        (apt) =>
          apt.doctorId === doctorId &&
          this.isWithinRange(new Date(apt.startTime), startDate, endDate)
      );
    } catch (error) {
      console.error('Error in getAppointmentsByDoctorAndDateRange:', error);
      throw error;
    }
  }

  /**
   * Get a populated appointment (with patient and doctor objects)
   *
   * This is useful for display purposes where you need patient/doctor details
   *
   */
  getPopulatedAppointment(appointment: Appointment): PopulatedAppointment | null {
    const doctor = getDoctorById(appointment.doctorId);
    const patient = getPatientById(appointment.patientId);

    if (!doctor || !patient) return null;

    return {
      ...appointment,
      doctor,
      patient,
    };
  }

  /**
   * Get all doctors
   *
   */
  getAllDoctors(): Doctor[] {
    return MOCK_DOCTORS;
  }

  /**
   * Get doctor by ID
   *
   */
  getDoctorById(id: string): Doctor | undefined {
     return MOCK_DOCTORS.find((doc) => doc.id === id);
  }

  /**
   * BONUS: Add any other helper methods you think would be useful
   * Examples:
   * - Sort appointments by time
   * - Check for overlapping appointments
   * - Get appointments by type
   * - etc.
   */
  /**
   * BONUS: Sort appointments by start time
   */
  sortAppointmentsByTime(appointments: Appointment[]): Appointment[] {
    return [...appointments].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }

  /**
   * BONUS: Check for overlapping appointments
   */
  hasOverlappingAppointments(appointments: Appointment[]): boolean {
    const sorted = this.sortAppointmentsByTime(appointments);
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentEnd = new Date(sorted[i].endTime).getTime();
      const nextStart = new Date(sorted[i + 1].startTime).getTime();
      if (currentEnd > nextStart) return true;
    }
    return false;
  }

  /**
   * Get all patients
   */
  getAllPatients(): Patient[] {
    return MOCK_PATIENTS;
  }
}

/**
 * Singleton instance (optional pattern)
 *
 * You can either:
 * 1. Export a singleton instance: export const appointmentService = new AppointmentService();
 * 2. Or let consumers create their own instances: new AppointmentService()
 *
 * Consider which is better for your architecture and testing needs.
 */
export const appointmentService = new AppointmentService();
