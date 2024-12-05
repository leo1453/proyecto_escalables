import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgFor, CommonModule,FormsModule], // Agrega CommonModule aquí
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css'],
})
export class NotasComponent implements OnInit {
  notes: Array<any> = [];
  editingNote: any = null; // Nota en edición
  openedNote: any = null; // Nota seleccionada para abrir
  selectedNote: any = null; // Nota seleccionada para mostrar en el modal

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  // Cargar las notas desde el backend
  loadNotes(): void {
    this.notesService.getAllNotes().subscribe(
      (data) => {
        this.notes = data.map((note) => ({
          ...note,
          date: new Date(note.createdAt).toLocaleString('es-MX'), // Formatear la fecha para mostrarla correctamente
        }));
      },
      (error) => {
        console.error('Error al cargar las notas:', error);
      }
    );
  }

  // Crear una nueva nota
  createNote(noteTitle: string, noteContent: string, course: string): void {
    const newNote = {
      title: noteTitle,
      content: noteContent,
      course,
      userId: localStorage.getItem('userId'), // Reemplaza esto con el ID del usuario autenticado
    };

    this.notesService.createNote(newNote).subscribe(
      (note) => {
        this.notes.push({
          ...note,
          date: new Date(note.createdAt).toLocaleString('es-MX'), // Formatear la fecha
        });
      },
      (error) => {
        console.error('Error al crear la nota:', error);
      }
    );
  }

  // Eliminar una nota
  deleteNote(noteId: string): void {
    if (!noteId) {
      console.error('El ID de la nota es undefined.');
      return;
    }
    this.notesService.deleteNote(noteId).subscribe(
      () => {
        this.notes = this.notes.filter((note) => note._id !== noteId); // Eliminar la nota localmente
      },
      (error) => {
        console.error('Error al eliminar la nota:', error);
      }
    );
  }
  
   // Habilitar edición de una nota
   startEdit(note: any): void {
    this.editingNote = { ...note }; // Crear una copia para no afectar directamente a la nota original
  }

   // Guardar cambios de una nota editada
   saveEdit(): void {
    if (this.editingNote) {
      this.notesService.updateNote(this.editingNote._id, this.editingNote).subscribe(
        (updatedNote) => {
          // Actualiza la nota localmente
          const index = this.notes.findIndex((note) => note._id === updatedNote._id);
          if (index !== -1) {
            this.notes[index] = {
              ...updatedNote,
              date: new Date(updatedNote.createdAt).toLocaleString('es-MX'),
            };
          }
          this.editingNote = null; // Cierra el modal
        },
        (error) => {
          console.error('Error al guardar la edición:', error);
        }
      );
    }
  }
  

  // Cancelar edición
  cancelEdit(): void {
    this.editingNote = null;
  }

    // Descargar notas como PDF
      // Método para descargar una nota específica como PDF
      downloadNotePDF(note: any): void {
        const doc = new jsPDF();
      
        // Encabezado
        doc.setFillColor(33, 150, 243); // Azul
        doc.rect(0, 0, 210, 30, 'F'); // Fondo del encabezado
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255); // Texto blanco
        doc.text('Detalles de la Nota', 105, 20, { align: 'center' });
      
        // Borde decorativo bajo el encabezado
        doc.setDrawColor(33, 150, 243); // Azul
        doc.setLineWidth(0.5);
        doc.line(10, 35, 200, 35); // Línea horizontal
      
        let yPosition = 45; // Posición inicial para el contenido
      
        // Título de la nota
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0); // Negro
        doc.text('Título:', 10, yPosition);
        doc.setTextColor(33, 150, 243); // Azul para el contenido
        doc.text(note.title, 40, yPosition);
      
        yPosition += 12;
      
        // Curso
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Curso:', 10, yPosition);
        doc.setTextColor(33, 150, 243);
        doc.text(note.course, 40, yPosition);
      
        yPosition += 12;
      
        // Fecha de creación
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Fecha de creación:', 10, yPosition);
        doc.setTextColor(33, 150, 243);
        doc.text(note.date, 55, yPosition);
      
        yPosition += 12;
      
        // Separador
        doc.setDrawColor(200, 200, 200); // Gris claro
        doc.line(10, yPosition, 200, yPosition);
      
        yPosition += 10;
      
        // Contenido
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Contenido:', 10, yPosition);
      
        yPosition += 8; // Espaciado antes del contenido
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50); // Gris oscuro
        doc.text(note.content, 10, yPosition, { maxWidth: 190 });
      
        yPosition += 50; // Espaciado después del contenido
      
        // Archivos adjuntos
        if (note.file) {
          const fileUrl = this.getFileUrl(note.file);
      
          if (this.isImageFile(note.file)) {
            // Si es una imagen, agrégala al PDF
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Archivo adjunto (Imagen):', 10, yPosition);
      
            yPosition += 10;
      
            doc.addImage(
              fileUrl, // La URL de la imagen
              'JPEG', // Formato de la imagen
              10,
              yPosition,
              180,
              100 // Ajusta el tamaño según sea necesario
            );
      
            yPosition += 110; // Espacio debajo de la imagen
          } else {
            // Si es otro tipo de archivo, agrega un enlace
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Archivo adjunto:', 10, yPosition);
      
            yPosition += 10;
      
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(12);
            doc.setTextColor(33, 150, 243); // Azul para enlaces
            doc.textWithLink('Descargar archivo', 10, yPosition, { url: fileUrl });
      
            yPosition += 10; // Espacio debajo del enlace
          }
        }
      
        // Footer decorativo
        doc.setFillColor(33, 150, 243); // Azul
        doc.rect(0, 280, 210, 20, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255); // Blanco
        doc.text(
          `Generado el ${new Date().toLocaleDateString()} - Sistema de Notas`,
          105,
          290,
          { align: 'center' }
        );
      
        // Guardar PDF
        doc.save(`${note.title || 'nota'}.pdf`);
      }
      
      
      sendNote(note: any): void {
        const baseUrl = 'http://localhost:8080/uploads'; // Cambia esto a tu URL base
      
        let message = `Nota:
        Título: ${note.title}
        Curso: ${note.course}
        Fecha de creación: ${note.date}
        Contenido: ${note.content}`;
      
        // Si existe un archivo adjunto, agrega el enlace al mensaje
        if (note.file) {
          const fileUrl = `${baseUrl}/${note.file}`;
          message += `\nArchivo adjunto: ${fileUrl}`;
        }
      
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
      
        window.open(whatsappUrl, '_blank'); // Abre WhatsApp en una nueva pestaña
      }
      
    
      
      

  // Manejar el envío del formulario para crear una nota
  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
  
    const noteTitle = (form.querySelector('input[name="noteTitle"]') as HTMLInputElement)?.value;
    const noteContent = (form.querySelector('textarea[name="noteContent"]') as HTMLTextAreaElement)?.value;
    const course = (form.querySelector('input[name="course"]') as HTMLInputElement)?.value;
    const fileInput = form.querySelector('input[name="noteFile"]') as HTMLInputElement;
  
    const file = fileInput?.files?.[0]; // Obtener el archivo, si existe
  
    if (!noteTitle || !noteContent || !course) {
      console.error('Faltan campos obligatorios');
      return;
    }
  
    const newNote = {
      title: noteTitle,
      content: noteContent,
      course,
      userId: localStorage.getItem('userId'), // Asegúrate de que el `userId` esté definido en el localStorage
    };
  
    if (file) {
      // Crear nota con archivo
      this.notesService.createNoteWithFile(newNote, file).subscribe(
        (note) => {
          this.notes.unshift({
            ...note,
            date: new Date(note.createdAt).toLocaleString('es-MX'),
          });
          console.log('Nota creada exitosamente con archivo:', note);
          form.reset();
        },
        (error) => {
          console.error('Error al crear la nota con archivo:', error);
        }
      );
    } else {
      // Crear nota sin archivo
      this.notesService.createNote(newNote).subscribe(
        (note) => {
          this.notes.unshift({
            ...note,
            date: new Date(note.createdAt).toLocaleString('es-MX'),
          });
          console.log('Nota creada exitosamente sin archivo:', note);
          form.reset();
        },
        (error) => {
          console.error('Error al crear la nota:', error);
        }
      );
    }
  }
  
  
  
  
  
// Abrir el modal con los detalles de la nota
openNote(note: any): void {
  console.log('Nota seleccionada:', note); // Verifica que 'file' esté presente
  this.openedNote = note;
}



// Cerrar el modal
closeNote(): void {
  this.openedNote = null;
}


// Obtener la URL del archivo para mostrarlo o descargarlo
getFileUrl(fileName: string): string {
  const baseUrl = 'http://localhost:8080/uploads'; // Asegúrate de que coincida con tu backend
  return `${baseUrl}/${fileName}`;
}

// Verificar si el archivo es una imagen
isImageFile(fileName: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  return imageExtensions.includes(fileExtension);
}

}