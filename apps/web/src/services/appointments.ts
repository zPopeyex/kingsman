import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query, 
  where,
  orderBy,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Appointment, AppointmentStatus } from '@/types/booking';
import { isSlotAvailable } from '@/utils/slots';

const COLLECTION_NAME = 'appointments';

/**
 * Obtiene citas de un barbero para una fecha
 */
export async function getAppointments(
  barberId: string, 
  date: string
): Promise<Appointment[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('barberId', '==', barberId),
      where('date', '==', date),
      orderBy('start', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Appointment));
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
}

/**
 * Crea una nueva cita con validación de disponibilidad
 */
export async function createAppointment(
  appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    // Usar transacción para atomicidad
    return await runTransaction(db, async (transaction) => {
      // Verificar disponibilidad dentro de la transacción
      const appointmentsRef = collection(db, COLLECTION_NAME);
      const q = query(
        appointmentsRef,
        where('barberId', '==', appointment.barberId),
        where('date', '==', appointment.date)
      );
      
      const snapshot = await getDocs(q);
      const existingAppointments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Appointment));
      
      // Verificar disponibilidad
      const available = await isSlotAvailable(
        appointment.date,
        appointment.start,
        appointment.barberId,
        existingAppointments
      );
      
      if (!available) {
        throw new Error('El horario seleccionado ya no está disponible');
      }
      
      // Crear la cita
      const docRef = doc(collection(db, COLLECTION_NAME));
      transaction.set(docRef, {
        ...appointment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

/**
 * Actualiza el estado de una cita
 */
export async function updateAppointmentStatus(
  appointmentId: string, 
  status: AppointmentStatus,
  cancellationReason?: string
): Promise<void> {
  try {
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }
    
    await updateDoc(doc(db, COLLECTION_NAME, appointmentId), updateData);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
}

/**
 * Obtiene una cita por ID
 */
export async function getAppointmentById(
  appointmentId: string
): Promise<Appointment | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, appointmentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Appointment;
    }
    return null;
  } catch (error) {
    console.error('Error getting appointment:', error);
    return null;
  }
}

/**
 * Obtiene todas las citas de un usuario
 */
export async function getUserAppointments(
  userId: string
): Promise<Appointment[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      orderBy('start', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Appointment));
  } catch (error) {
    console.error('Error getting user appointments:', error);
    return [];
  }
}

/**
 * Reagenda una cita
 */
export async function rescheduleAppointment(
  appointmentId: string,
  newDate: string,
  newStart: string,
  newEnd: string
): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      // Obtener la cita actual
      const appointmentRef = doc(db, COLLECTION_NAME, appointmentId);
      const appointmentSnap = await transaction.get(appointmentRef);
      
      if (!appointmentSnap.exists()) {
        throw new Error('Cita no encontrada');
      }
      
      const appointment = appointmentSnap.data() as Appointment;
      
      // Verificar disponibilidad del nuevo horario
      const q = query(
        collection(db, COLLECTION_NAME),
        where('barberId', '==', appointment.barberId),
        where('date', '==', newDate)
      );
      
      const snapshot = await getDocs(q);
      const existingAppointments = snapshot.docs
        .filter(doc => doc.id !== appointmentId) // Excluir la cita actual
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Appointment));
      
      const available = await isSlotAvailable(
        newDate,
        newStart,
        appointment.barberId,
        existingAppointments
      );
      
      if (!available) {
        throw new Error('El nuevo horario no está disponible');
      }
      
      // Actualizar la cita
      transaction.update(appointmentRef, {
        date: newDate,
        start: newStart,
        end: newEnd,
        status: 'rescheduled',
        updatedAt: serverTimestamp()
      });
    });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    throw error;
  }
}

/**
 * Obtiene citas por rango de fechas
 */
export async function getAppointmentsByDateRange(
  startDate: string,
  endDate: string,
  barberId?: string
): Promise<Appointment[]> {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc'),
      orderBy('start', 'asc')
    );
    
    if (barberId) {
      q = query(
        collection(db, COLLECTION_NAME),
        where('barberId', '==', barberId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'asc'),
        orderBy('start', 'asc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Appointment));
  } catch (error) {
    console.error('Error getting appointments by date range:', error);
    return [];
  }
}