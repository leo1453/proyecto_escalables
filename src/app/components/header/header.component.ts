import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar *ngIf

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], // Asegúrate de incluir CommonModule aquí
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = false;
  username: string | null = null;

  constructor(private router: Router) {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.username = localStorage.getItem('username'); // Recupera el nombre del usuario
    console.log('Nombre de usuario en el header:', this.username); // Verifica en la consola del navegador
  }
  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.isLoggedIn = false;
    this.username = null;
    this.router.navigate(['/inicio']);
  }
}