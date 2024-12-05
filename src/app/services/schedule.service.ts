import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:8080/api/schedules'; // URL base para los horarios

  constructor(private http: HttpClient) {}

  // Crear horario
  createSchedule(scheduleData: any) {
    const token = localStorage.getItem('token'); // Obtiene el token del usuario
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/create`, scheduleData, { headers });
  }

  // Obtener horario de un usuario
  getSchedule(userId: string) {
    const token = localStorage.getItem('token'); // Obtiene el token del usuario
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${userId}`, { headers });
  }
}
