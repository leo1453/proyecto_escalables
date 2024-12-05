import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService {
  private baseUrl = 'http://localhost:8080/api/assignments'; // Cambia al URL correcto si es necesario

  constructor(private http: HttpClient) {}

  // Obtener todas las asignaciones con filtros
  getAssignments(): Observable<any[]> {
    const userId = localStorage.getItem('userId'); // Obtén el userId desde el localStorage
    const token = localStorage.getItem('token'); // Asegúrate de obtener el token también si es necesario
  
    if (!userId) {
      // Si no se encuentra el userId, puedes manejar el error, por ejemplo, redirigiendo al login
      console.error('No se encontró el userId en localStorage');
      return new Observable(); // Devolviendo un observable vacío o un error
    }
  
    return this.http.get<any[]>(`${this.baseUrl}?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Agrega el token en las cabeceras
      }
    });
  }
  

  // Crear una nueva asignación
 // Método para crear una asignación en el servicio
createAssignment(assignment: any): Observable<any> {
  const token = localStorage.getItem('token'); // Asegúrate de obtener el token
  if (!token) {
    console.error('Token no encontrado en localStorage');
    return new Observable<any>(); // Retorna un observable vacío si no hay token
  }

  // Incluye el encabezado Authorization con el token
  return this.http.post(this.baseUrl, assignment, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

  

  // Eliminar una asignación
  deleteAssignment(id: string): Observable<any> {
    const token = localStorage.getItem('token'); // Obtiene el token
    if (!token) {
      console.error('Token no encontrado');
      return new Observable<any>();
    }
    
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
      },
    });
  }
  

  // Actualizar una asignación
  updateAssignment(id: string, updatedTask: any): Observable<any> {
    const token = localStorage.getItem('token'); // Obtén el token del localStorage
    if (!token) {
      console.error('Token no encontrado');
      return new Observable<any>();
    }
  
    return this.http.put(`${this.baseUrl}/${id}`, updatedTask, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
      },
    });
  }

    // Obtener asignaciones con filtros
    getAssignmentsWithFilters(filters: any): Observable<any[]> {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      let params: any = { userId };
  
      if (filters.search) params.search = filters.search;
      if (filters.tipo) params.tipo = filters.tipo;
      if (filters.prioridad) params.prioridad = filters.prioridad;
      if (filters.fecha) params.fecha = filters.fecha;
  
      return this.http.get<any[]>(this.baseUrl, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
    }

      // Actualizar el estado de completado de una asignación
      updateCompleted(id: string, completed: boolean): Observable<any> {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token no encontrado');
          return new Observable<any>();
        }
      
        return this.http.put(`${this.baseUrl}/${id}/completed`, { completed }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      
  
}
