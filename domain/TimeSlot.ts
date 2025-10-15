/**
 * TimeSlot Utility
 *
 * Generates a list of time slots for a given date, duration, and working hours.
 * Useful for appointment booking, doctor scheduling, etc.
 */

export interface TimeSlot {
  start: Date;
  end: Date;
}

interface GenerateTimeSlotsOptions {
  date: Date;
  startHour?: number;    // default: 8 (8:00 AM)
  endHour?: number;      // default: 18 (6:00 PM)
  slotDurationMinutes?: number; // default: 30 minutes
}

/**
 * Generates time slots for a single day.
 *
 * Example:
 *  generateTimeSlots({ date: new Date(), startHour: 9, endHour: 17, slotDurationMinutes: 30 })
 */
export function generateTimeSlots({
  date,
  startHour = 8,
  endHour = 18,
  slotDurationMinutes = 30,
}: GenerateTimeSlotsOptions): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // Clone base date and normalize time
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
      const start = new Date(baseDate);
      start.setHours(hour, minute, 0, 0);

      const end = new Date(start);
      end.setMinutes(start.getMinutes() + slotDurationMinutes);

      // Avoid exceeding endHour boundary
      if (end.getHours() >= endHour && end.getMinutes() > 0) continue;

      slots.push({ start, end });
    }
  }

  return slots;
}
