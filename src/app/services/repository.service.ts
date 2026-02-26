import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  CollectionReference, 
  DocumentReference,
  query
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepositoryItem } from '../interfaces/repository';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  // Use the Firestore instance provided by AngularFire
  private firestore = inject(Firestore);

  private get projectsCollection() {
    // Ensure the collection is created using the same SDK instance
    return collection(this.firestore, 'projects') as CollectionReference<RepositoryItem>;
  }

  /**
   * Retrieves all projects from Firestore.
   */
  getProjects(): Observable<RepositoryItem[]> {
    return from(getDocs(this.projectsCollection)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() } as RepositoryItem;
        });
      })
    );
  }

  /**
   * Adds a new project to Firestore.
   */
  addProject(project: Omit<RepositoryItem, 'id'>): Observable<DocumentReference<RepositoryItem>> {
    return from(addDoc(this.projectsCollection, project));
  }

  /**
   * Updates an existing project in Firestore.
   */
  updateProject(project: RepositoryItem): Observable<void> {
    const { id, ...data } = project;
    const projectDocRef = doc(this.firestore, `projects/${id}`) as DocumentReference<RepositoryItem>;
    return from(updateDoc(projectDocRef, data as any));
  }

  /**
   * Deletes a project from Firestore.
   */
  deleteProject(projectId: string): Observable<void> {
    const projectDocRef = doc(this.firestore, `projects/${projectId}`) as DocumentReference<RepositoryItem>;
    return from(deleteDoc(projectDocRef));
  }

  /**
   * Retrieves a specific project by ID from Firestore.
   */
  getProjectById(projectId: string): Observable<RepositoryItem | null> {
    const projectDocRef = doc(this.firestore, `projects/${projectId}`) as DocumentReference<RepositoryItem>;
    return from(getDoc(projectDocRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return { id: docSnapshot.id, ...docSnapshot.data() } as RepositoryItem;
        } else {
          return null;
        }
      })
    );
  }
}
