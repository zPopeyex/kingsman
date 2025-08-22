// src/services/firebase-portfolio.ts
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase'; // Tu configuración Firebase

export interface PortfolioImage {
  id: string;
  title: string;
  caption: string;
  category: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  priority: boolean;
  palette: string[];
}

// Guardar todo el portfolio en Firestore
export const savePortfolioToFirebase = async (works: PortfolioImage[]): Promise<void> => {
  try {
    await setDoc(doc(db, 'portfolio', 'works'), {
      items: works,
      lastUpdated: new Date(),
    });
    console.log('Portfolio guardado en Firebase');
  } catch (error) {
    console.error('Error guardando portfolio:', error);
    throw error;
  }
};

// Cargar portfolio desde Firestore
export const loadPortfolioFromFirebase = async (): Promise<PortfolioImage[]> => {
  try {
    const docRef = doc(db, 'portfolio', 'works');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.items || [];
    } else {
      console.log('No portfolio data found');
      return [];
    }
  } catch (error) {
    console.error('Error loading portfolio:', error);
    throw error;
  }
};

// Subir imagen a Firebase Storage
export const uploadImageToFirebase = async (file: File, workId: string): Promise<string> => {
  try {
    // Crear nombre único para la imagen
    const fileName = `${workId}_${Date.now()}_${file.name.replace(/\s+/g, '-')}`;
    const imageRef = ref(storage, `portfolio/${fileName}`);
    
    // Subir archivo
    const snapshot = await uploadBytes(imageRef, file);
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Imagen subida exitosamente:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw error;
  }
};

// Eliminar imagen de Firebase Storage
export const deleteImageFromFirebase = async (imageUrl: string): Promise<void> => {
  try {
    // Extraer path de la URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log('Imagen eliminada de Firebase Storage');
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    // No lanzar error porque la imagen podría no existir
  }
};