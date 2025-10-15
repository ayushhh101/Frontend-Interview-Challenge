import { useMemo, useState } from 'react';
import type { Appointment, AppointmentType } from '@/types';
import { getPatientById } from '@/data/mockData';

interface UseAppointmentSearchParams {
  appointments: Appointment[];
}

interface UseAppointmentSearchReturn {
  filteredAppointments: Appointment[];
  searchTerm: string;
  selectedType: AppointmentType | 'all';
  setSearchTerm: (term: string) => void;
  setSelectedType: (type: AppointmentType | 'all') => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function useAppointmentSearch({
  appointments,
}: UseAppointmentSearchParams): UseAppointmentSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<AppointmentType | 'all'>('all');

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Filter by search term (patient name)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((appointment) => {
        const patient = getPatientById(appointment.patientId);
        return patient?.name.toLowerCase().includes(searchLower);
      });
    }

    // Filter by appointment type
    if (selectedType !== 'all') {
      filtered = filtered.filter((appointment) => appointment.type === selectedType);
    }

    return filtered;
  }, [appointments, searchTerm, selectedType]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
  };

  const hasActiveFilters = searchTerm.trim() !== '' || selectedType !== 'all';

  return {
    filteredAppointments,
    searchTerm,
    selectedType,
    setSearchTerm,
    setSelectedType,
    clearFilters,
    hasActiveFilters,
  };
}