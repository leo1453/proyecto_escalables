import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:8080/api/users'; // URL de tu backend

  constructor(private http: HttpClient, private authService: AuthService) {} // Asegúrate de inyectar el AuthService

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

 // Método para obtener todos los usuarios, excluyendo al usuario autenticado
 getAllUsers(): Observable<any> {
  return this.http.get<any[]>(this.apiUrl).pipe(
    map((users) => {
      const authenticatedUserId = this.authService.getUserId(); // Obtén el ID del usuario autenticado
      return users.filter((user) => user._id !== authenticatedUserId); // Filtra el usuario con sesión iniciada
    })
  );
}

deleteUser(userId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${userId}`);
}

}