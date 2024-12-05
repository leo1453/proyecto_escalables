import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private apiUrl = 'http://localhost:8080/api/notes'; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener todas las notas
  getAllNotes(): Observable<any[]> {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // Crear una nueva nota
  createNote(note: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, note);
  }

  // Eliminar una nota
  deleteNote(noteId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${noteId}`);
  }

 
  // Actualizar una nota
  updateNote(noteId: string, updatedNote: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${noteId}`, updatedNote);
  }
  
  // Crear una nueva nota con archivo
  createNoteWithFile(noteData: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('title', noteData.title);
    formData.append('content', noteData.content);
    formData.append('course', noteData.course);
    formData.append('userId', noteData.userId);
  
    if (file) {
      formData.append('file', file); // 'file' debe coincidir con el nombre esperado en el backend
    }
  
    return this.http.post<any>(this.apiUrl, formData);
  }
  
  

  
}
