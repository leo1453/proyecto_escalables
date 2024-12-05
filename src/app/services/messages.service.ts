import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'http://localhost:8080/api/messages'; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener mensajes entre dos usuarios
  getMessages(receiverId: string): Observable<any> {
    const token = localStorage.getItem('token'); // O el método adecuado para obtener el token
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<any>(`${this.apiUrl}?receiverId=${receiverId}`, { headers });
  }
  

  // Enviar mensaje
  // Enviar mensaje
sendMessage(receiverId: string, content: string): Observable<any> {
  const token = localStorage.getItem('token'); // O el método adecuado para obtener el token

  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // Asegúrate de que el campo sea "receiver" en lugar de "receiverId"
  return this.http.post<any>(this.apiUrl, { receiver: receiverId, content }, { headers });
}

}
