import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    console.log('AdminGuard se está ejecutando');
    const role = localStorage.getItem('role');
    console.log('Rol recibido:', role);
    if (role === 'admin') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
  
}
