import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WorkingSchedule } from '@/types/booking';

const COLLECTION_NAME = 'workingSchedules';

/**
 * Obtiene el horario de trabajo de un barbero para una fecha
 */
export async function getWorkingSchedule(
  barberId: string, 
  date: string
): Promise<WorkingSchedule | null> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('barberId', '==', barberId),
      where('date', '==', date)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as WorkingSchedule;
  } catch (error) {
    console.error('Error getting working schedule:', error);
    return null;
  }
}

/**
 * Obtiene todos los horarios de un barbero
 */
export async function getBarberSchedules(
  barberId: string
): Promise<WorkingSchedule[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('barberId', '==', barberId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WorkingSchedule));
  } catch (error) {
    console.error('Error getting barber schedules:', error);
    return [];
  }
}

/**
 * Crea o actualiza un horario de trabajo
 */
export async function saveWorkingSchedule(
  schedule: Omit<WorkingSchedule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    // Verificar si ya existe para esa fecha y barbero
    const existing = await getWorkingSchedule(schedule.barberId, schedule.date);
    
    if (existing) {
      // Actualizar existente
      await updateDoc(doc(db, COLLECTION_NAME, existing.id), {
        ...schedule,
        updatedAt: serverTimestamp()
      });
      return existing.id;
    } else {
      // Crear nuevo
      const docRef = doc(collection(db, COLLECTION_NAME));
      await setDoc(docRef, {
        ...schedule,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving working schedule:', error);
    throw error;
  }
}

/**
 * Elimina un horario de trabajo
 */
export async function deleteWorkingSchedule(scheduleId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, scheduleId));
  } catch (error) {
    console.error('Error deleting working schedule:', error);
    throw error;
  }
}

/**
 * Obtiene horarios de múltiples barberos para una fecha
 */
export async function getSchedulesByDate(
  date: string
): Promise<WorkingSchedule[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('date', '==', date)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WorkingSchedule));
  } catch (error) {
    console.error('Error getting schedules by date:', error);
    return [];
  }
}

/**
 * Verifica si un barbero trabaja en una fecha
 */
export async function isBarberAvailable(
  barberId: string,
  date: string
): Promise<boolean> {
  const schedule = await getWorkingSchedule(barberId, date);
  return schedule !== null;
}