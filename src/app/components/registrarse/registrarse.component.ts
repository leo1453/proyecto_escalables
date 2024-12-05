import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms'; // Importa FormsModule
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { FooterComponent } from '../footer/footer.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [FormsModule, FooterComponent, RouterModule, NgIf], // Agrega FormsModule aquí
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent {

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private router: Router, private userService: UsersService) {}

  onSubmit(form: NgForm) {
    const { nombre_usuario, email, password, confirm_password } = form.value;

     // Validar formato del correo electrónico
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para correos válidos
     if (!emailRegex.test(email)) {
       this.errorMessage = 'Por favor, ingresa un correo electrónico válido.';
       this.successMessage = null;
       return;
     }
     
    if (password !== confirm_password) {
      this.errorMessage = 'Las contraseñas no coinciden';
      this.successMessage = null;
      return;
    }

    // Enviar los datos al backend
    this.userService.registerUser({ name: nombre_usuario, email, password }).subscribe({
      next: (response) => {
        this.successMessage = 'Registro exitoso. Ahora puedes iniciar sesión.';
        this.errorMessage = null;
        form.resetForm();

        // Redirigir después de un tiempo
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Error al registrar usuario: ' + error.error.msg || 'Inténtalo de nuevo más tarde.';
        this.successMessage = null;
      }
    });
  }
}
