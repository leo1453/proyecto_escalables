import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { NgFor } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgFor, HeaderComponent, FooterComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  users: any[] = []; // Lista de usuarios

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

// Cargar todos los usuarios desde el backend
loadUsers(): void {
  this.usersService.getAllUsers().subscribe(
    (data) => {
      this.users = data;
    },
    (error) => {
      console.error('Error al cargar los usuarios:', error);
    }
  );
}

// Eliminar un usuario
deleteUser(userId: string): void {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    this.usersService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter((user) => user._id !== userId); // Elimina el usuario de la lista local
        alert('Usuario eliminado correctamente');
      },
      (error) => {
        console.error('Error al eliminar el usuario:', error);
        alert('No se pudo eliminar el usuario');
      }
    );
  }
}
}