import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../footer/footer.component';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa FormsModule y ReactiveFormsModule

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css'],
  imports: [FormsModule, ReactiveFormsModule, FooterComponent, NgIf] // Agrega FormsModule y ReactiveFormsModule
})
export class IniciarSesionComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
    } else {
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso:', response);
          // Guarda el token y el nombre del usuario en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username); // Guarda el nombre del usuario
          localStorage.setItem('role', response.role); // Guarda el rol del usuario

          // Redirige según el rol del usuario
          if (response.role === 'admin') {
            this.router.navigate(['/admin']); // Redirige al administrador a la página de administración
          } else {
            this.router.navigate(['/inicio']); // Redirige a usuarios normales al inicio
          }
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          this.errorMessage = 'Credenciales incorrectas o error en el servidor.';
        }
      });
    }
  }
}