import { db } from './config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface ProjectData {
  userId: string;
  name: string;
  category: string;
  sceneData: {
    cameraPosition: { x: number; y: number; z: number };
    ambientLightIntensity: number;
    directionalLightIntensity: number;
    directionalLightPosition: { x: number; y: number; z: number };
    environmentPreset: string;
    backgroundColor: string;
    cameraType: 'perspective' | 'orthographic';
    environmentIntensity: number;
    environmentRotation: number;
    mockupMaterial: 'glass' | 'platinum' | 'clay light' | 'clay dark';
    modelPosition: { x: number; y: number; z: number };
    modelRotation: { x: number; y: number; z: number };
    backgroundImageFit: 'fill' | 'fit';
    screenImage: string | null;
  };
}

export async function saveProject(user: User, projectData: ProjectData) {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
}

export async function updateProject(projectId: string, projectData: Partial<ProjectData>) {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...projectData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(projectId: string) {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function getUserProjects(userId: string) {
  try {
    const q = query(collection(db, 'projects'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw error;
  }
}
