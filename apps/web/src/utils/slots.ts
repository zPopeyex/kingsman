import type { Appointment, TimeSlot } from '@/types/booking';

/**
 * Genera slots de tiempo entre hora inicio y fin
 */
export function generateSlots(
  date: string,
  startTime: string,
  endTime: string,
  slotMinutes: number = 30
): string[] {
  const slots: string[] = [];
  
  // Crear objetos Date para manipulación
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const start = new Date(`${date}T${startTime}:00`);
  const end = new Date(`${date}T${endTime}:00`);
  
  // Generar slots
  const current = new Date(start);
  while (current < end) {
    const hours = current.getHours().toString().padStart(2, '0');
    const minutes = current.getMinutes().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}`);
    
    // Avanzar al siguiente slot
    current.setMinutes(current.getMinutes() + slotMinutes);
  }
  
  return slots;
}

/**
 * Filtra slots ocupados basándose en citas existentes
 */
export function filterTakenSlots(
  slots: string[],
  appointments: Appointment[]
): TimeSlot[] {
  const timeSlots: TimeSlot[] = [];
  
  for (const slot of slots) {
    const isOccupied = appointments.some(apt => {
      // Verificar si el slot está dentro del rango de la cita
      const slotTime = timeToMinutes(slot);
      const aptStart = timeToMinutes(apt.start);
      const aptEnd = timeToMinutes(apt.end);
      
      return slotTime >= aptStart && slotTime < aptEnd && 
             apt.status !== 'cancelled' && apt.status !== 'failed';
    });
    
    const occupyingAppointment = appointments.find(apt => {
      const slotTime = timeToMinutes(slot);
      const aptStart = timeToMinutes(apt.start);
      const aptEnd = timeToMinutes(apt.end);
      
      return slotTime >= aptStart && slotTime < aptEnd && 
             apt.status !== 'cancelled' && apt.status !== 'failed';
    });
    
    timeSlots.push({
      time: slot,
      available: !isOccupied,
      appointmentId: occupyingAppointment?.id
    });
  }
  
  return timeSlots;
}

/**
 * Verifica si un slot específico está disponible
 */
export async function isSlotAvailable(
  date: string,
  time: string,
  barberId: string,
  appointments: Appointment[]
): Promise<boolean> {
  const slotTime = timeToMinutes(time);
  
  // Verificar conflictos con citas existentes
  const hasConflict = appointments.some(apt => {
    if (apt.barberId !== barberId || apt.date !== date) return false;
    if (apt.status === 'cancelled' || apt.status === 'failed') return false;
    
    const aptStart = timeToMinutes(apt.start);
    const aptEnd = timeToMinutes(apt.end);
    
    // Verificar solapamiento
    return slotTime >= aptStart && slotTime < aptEnd;
  });
  
  return !hasConflict;
}

/**
 * Convierte tiempo HH:mm a minutos desde medianoche
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convierte minutos a formato HH:mm
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Calcula el slot de fin basado en duración
 */
export function calculateEndTime(
  startTime: string,
  durationMinutes: number
): string {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + durationMinutes;
  return minutesToTime(endMinutes);
}

/**
 * Obtiene el siguiente slot disponible
 */
export function getNextAvailableSlot(
  slots: TimeSlot[],
  fromTime?: string
): TimeSlot | null {
  const fromMinutes = fromTime ? timeToMinutes(fromTime) : 0;
  
  return slots.find(slot => {
    const slotMinutes = timeToMinutes(slot.time);
    return slot.available && slotMinutes >= fromMinutes;
  }) || null;
}

/**
 * Agrupa slots por período (mañana/tarde)
 */
export function groupSlotsByPeriod(slots: TimeSlot[]): {
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
} {
  const morning: TimeSlot[] = [];
  const afternoon: TimeSlot[] = [];
  const evening: TimeSlot[] = [];
  
  slots.forEach(slot => {
    const minutes = timeToMinutes(slot.time);
    const hours = Math.floor(minutes / 60);
    
    if (hours < 12) {
      morning.push(slot);
    } else if (hours < 17) {
      afternoon.push(slot);
    } else {
      evening.push(slot);
    }
  });
  
  return { morning, afternoon, evening };
}