import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css'
})
export class IniciarSesionComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
    } else {
      this.errorMessage = null;
      console.log('Email:', this.email);
      console.log('Password:', this.password);
    }
  }
}