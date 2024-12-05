import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token'; // Clave para almacenar el token
  private apiUrl = 'http://localhost:8080/api/auth'; // URL de tu backend

  constructor(private http: HttpClient) {}

  // Iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        console.log('Respuesta del backend:', response); // Para depurar
        if (response.userId) {
          localStorage.setItem('userId', response.userId); // Guarda el userId
          localStorage.setItem('token', response.token);  // Guarda el token
          localStorage.setItem('role', response.role); // Guarda el rol
          localStorage.setItem('username', response.username); // Guarda el nombre de usuario
        } else {
          console.error('No se recibió el userId en la respuesta del backend');
        }
      })
    );
  }
  

  // Guardar el token en el localStorage
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtener el token desde el localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Obtener el userId desde el token JWT
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload del JWT
      return payload.userId; // Asegúrate de que el token incluye el campo `userId`
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
