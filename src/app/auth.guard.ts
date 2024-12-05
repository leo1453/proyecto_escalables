import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Verifica si el usuario tiene un token
    if (token) {
      return true; // Permite el acceso si hay un token
    } else {
      this.router.navigate(['/inicio']); // Redirige al inicio si no hay token
      return false;
    }
  }
}
