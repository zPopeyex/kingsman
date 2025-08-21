import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Barber } from '@/types/booking';

const COLLECTION_NAME = 'barbers';

// Mock data mientras no hay UI de admin para crear barberos
const DEFAULT_BARBERS: Omit<Barber, 'id'>[] = [
  {
    displayName: 'Carlos Rodríguez',
    phone: '3001234567',
    role: 'admin',
    active: true,
    avatar: '👨‍🦱',
    specialty: 'Fade & Diseños'
  },
  {
    displayName: 'Miguel Ángel',
    phone: '3009876543',
    role: 'dev',
    active: true,
    avatar: '🧔',
    specialty: 'Barbas & Afeitado'
  },
  {
    displayName: 'Andrés Silva',
    phone: '3007654321',
    role: 'client',
    active: true,
    avatar: '👨',
    specialty: 'Cortes Clásicos'
  }
];

/**
 * Obtiene todos los barberos activos
 */
export async function getActiveBarbers(): Promise<Barber[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('active', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    // Si no hay barberos, crear los default
    if (snapshot.empty) {
      console.log('No hay barberos, creando defaults...');
      await initializeDefaultBarbers();
      return await getActiveBarbers(); // Recursivo para obtener los creados
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Barber));
  } catch (error) {
    console.error('Error getting barbers:', error);
    // Retornar mock data si falla Firebase
    return DEFAULT_BARBERS.map((b, i) => ({ ...b, id: `mock-${i}` }));
  }
}

/**
 * Obtiene un barbero por ID
 */
export async function getBarberById(barberId: string): Promise<Barber | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, barberId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Barber;
    }
    return null;
  } catch (error) {
    console.error('Error getting barber:', error);
    return null;
  }
}

/**
 * Inicializa barberos por defecto
 */
async function initializeDefaultBarbers(): Promise<void> {
  try {
    for (const barber of DEFAULT_BARBERS) {
      const docRef = doc(collection(db, COLLECTION_NAME));
      await setDoc(docRef, {
        ...barber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('✅ Barberos default creados');
  } catch (error) {
    console.error('Error creating default barbers:', error);
  }
}

/**
 * Crea o actualiza un barbero
 */
export async function saveBarber(
  barber: Omit<Barber, 'id'>,
  barberId?: string
): Promise<string> {
  try {
    if (barberId) {
      // Actualizar existente
      await updateDoc(doc(db, COLLECTION_NAME, barberId), {
        ...barber,
        updatedAt: serverTimestamp()
      });
      return barberId;
    } else {
      // Crear nuevo
      const docRef = doc(collection(db, COLLECTION_NAME));
      await setDoc(docRef, {
        ...barber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving barber:', error);
    throw error;
  }
}