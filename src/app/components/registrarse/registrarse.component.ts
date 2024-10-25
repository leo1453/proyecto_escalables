import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [NgIf],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css'
})
export class RegistrarseComponent {

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private router: Router) {}

  onSubmit(form: NgForm) {
    const { nombre_usuario, email, password, confirm_password } = form.value;

    if (password !== confirm_password) {
      this.errorMessage = 'Las contraseñas no coinciden';
      this.successMessage = null;
      return;
    }

   
    this.successMessage = 'Registro exitoso. Ahora puedes iniciar sesión.';
    this.errorMessage = null;

    form.resetForm();

 
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}