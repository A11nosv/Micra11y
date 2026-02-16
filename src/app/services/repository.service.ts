import { Injectable } from '@angular/core';
import { Firestore, CollectionReference, DocumentReference, doc, collection, addDoc, updateDoc, deleteDoc, getDocs, query, where, getDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RepositoryItem } from '../interfaces/repository'; // Assuming this interface is defined

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private projectsCollection: CollectionReference<RepositoryItem>;

  constructor(private firestore: Firestore, private storage: Storage) {
    this.projectsCollection = collection(this.firestore, 'projects') as CollectionReference<RepositoryItem>;
  }

  /**
   * Adds a new project to Firestore.
   * @param project The project data to add.
   * @returns An Observable of the DocumentReference for the newly added project.
   */
  addProject(project: Omit<RepositoryItem, 'id'>): Observable<DocumentReference<RepositoryItem>> {
    return from(addDoc(this.projectsCollection, project));
  }

  /**
   * Updates an existing project in Firestore.
   * @param project The project data to update, including its ID.
   * @returns An Observable that completes when the update is done.
   */
  updateProject(project: RepositoryItem): Observable<void> {
    const projectDocRef = doc(this.firestore, `projects/${project.id}`) as DocumentReference<RepositoryItem>;
    return from(updateDoc(projectDocRef, { ...project }));
  }

  /**
   * Deletes a project from Firestore.
   * @param projectId The ID of the project to delete.
   * @returns An Observable that completes when the deletion is done.
   */
  deleteProject(projectId: string): Observable<void> {
    const projectDocRef = doc(this.firestore, `projects/${projectId}`) as DocumentReference<RepositoryItem>;
    return from(deleteDoc(projectDocRef));
  }

  /**
   * Retrieves all projects from Firestore.
   * @returns An Observable of an array of RepositoryItem.
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
   * Retrieves a specific project by ID from Firestore.
   * @param projectId The ID of the project to retrieve.
   * @returns An Observable of the RepositoryItem, or null if not found.
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

  /**
   * Uploads a file to Firebase Storage in the 'codes' folder.
   * @param file The file to upload.
   * @param fileName The name of the file in storage.
   * @returns An Observable of the download URL of the uploaded file.
   */
  uploadCodeFile(file: File, fileName: string): Observable<string> {
    const filePath = `codes/${fileName}`;
    const storageRef = ref(this.storage, filePath);
    return from(uploadBytes(storageRef, file)).pipe(
      switchMap(snapshot => from(getDownloadURL(snapshot.ref))) // Use switchMap and from() to handle the Promise
    );
  }
}
