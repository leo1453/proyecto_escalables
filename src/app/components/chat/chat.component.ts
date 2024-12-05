import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UsersService } from '../../services/users.service'; // Asegúrate de que la ruta sea correcta
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { MessagesService } from '../../services/messages.service'; // Importa el servicio de mensajes
import { NgFor, NgIf } from '@angular/common';
import { Message } from '../../models/message.model'; // Ajusta la ruta según la ubicación real
import { User } from '../../models/user.model'; // Ajusta la ruta según la ubicación del archivo

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent, NgFor, NgIf],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  users: any[] = []; // Lista completa de usuarios
  filteredUsers: any[] = []; // Lista de usuarios filtrados por búsqueda
  selectedUser: any = null; // Usuario seleccionado
  messages: any[] = []; // Lista de mensajes
  messageContent: string = ''; // Contenido del mensaje a enviar
  searchQuery: string = ''; // Texto de búsqueda
  currentUserId: string | null = null; // ID del usuario autenticado

  constructor(
    private usersService: UsersService,
    public authService: AuthService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario autenticado desde localStorage
    this.currentUserId = localStorage.getItem('userId');
    console.log('ID del usuario autenticado:', this.currentUserId);

    // Obtener todos los usuarios al cargar el componente
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getAllUsers().subscribe(
      (users: User[]) => { // Especifica que `users` es un arreglo de `User`
        const authenticatedUserId = this.currentUserId; // ID del usuario autenticado
        this.users = users.filter((user: User) => user._id !== authenticatedUserId); // Especifica el tipo de `user`
        this.filteredUsers = this.users; // Inicializa los usuarios filtrados
        console.log('Usuarios filtrados:', this.users); // Depuración
      },
      (error) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }
  

  // Método para seleccionar un usuario
  selectUser(user: any): void {
    this.selectedUser = user; // Asigna el usuario seleccionado
    this.loadMessages(user._id); // Cargar los mensajes con el usuario seleccionado
  }

  // Método para cargar los mensajes entre el usuario autenticado y el usuario seleccionado
  loadMessages(otherUserId: string): void {
    this.messagesService.getMessages(otherUserId).subscribe(
      (messages: Message[]) => {
        this.messages = messages.map((message: Message) => {
          const isOwnMessage = message.sender === this.currentUserId;
          console.log(`Mensaje: ${message.content}, Enviado por mí: ${isOwnMessage}`);
          return {
            ...message,
            senderName: isOwnMessage ? 'Tú' : this.getUserNameById(message.sender),
            isOwnMessage // Indica si es del usuario autenticado
          };
        }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        setTimeout(() => this.scrollToBottom(), 0); // Desplaza al final tras renderizar
      },
      (error) => {
        console.error('Error al cargar los mensajes', error);
      }
    );
  }

  // Método para obtener el nombre del usuario por ID
  getUserNameById(userId: string): string {
    const user = this.users.find(user => user._id === userId);
    return user ? user.name : 'Desconocido';
  }

  // Método para enviar un mensaje
  sendMessage(event?: Event): void {
    if (event) {
      event.preventDefault(); // Evita el comportamiento por defecto (como el submit del formulario)
    }
    if (!this.messageContent.trim()) return;

    const receiverId = this.selectedUser._id;

    this.messagesService.sendMessage(receiverId, this.messageContent).subscribe(
      () => {
        this.messages.push({
          sender: this.currentUserId,
          receiver: receiverId,
          content: this.messageContent,
          timestamp: new Date(),
          isOwnMessage: true, // Marca como mensaje propio
          senderName: 'Tú' // Asegúrate de incluir 'Tú' como nombre del remitente

        });
        this.messageContent = ''; // Limpia el mensaje
        setTimeout(() => this.scrollToBottom(), 0); // Desplaza al final tras renderizar
      },
      (error) => {
        console.error('Error al enviar el mensaje', error);
      }
    );
  }

  // Método para filtrar la lista de usuarios por el texto de búsqueda
  searchUsers(): void {
    if (!this.searchQuery.trim()) {
      // Si el campo de búsqueda está vacío, muestra todos los usuarios
      this.filteredUsers = this.users;
    } else {
      // Filtra los usuarios basándose en el nombre de usuario (case insensitive)
      const query = this.searchQuery.toLowerCase();
      this.filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(query));
    }
  }
  

  // Método para desplazar el chat hacia el final
  scrollToBottom(): void {
    setTimeout(() => {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight; // Desplázate al final del contenedor
      }
    }, 0); // Ejecuta el desplazamiento después de que se haya renderizado el contenido
  }
}
