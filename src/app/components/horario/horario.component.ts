import { NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { ScheduleService } from '../../services/schedule.service'; // Importa el servicio
import { AuthService } from '../../services/auth.service'; // Importa el servicio de autenticación
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [NgFor, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements AfterViewInit {
  @ViewChild('scheduleTable', { static: true }) scheduleTable!: ElementRef<HTMLTableElement>;

  hours: string[] = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'
  ];
  
  subjects: { name: string; profesor: string; salon: string; area: string }[] = [
    { name: 'Herramientas de software', profesor: 'Prof. García', salon: 'A101', area: 'Ingeniería' },
    { name: 'Física', profesor: 'Prof. Pérez', salon: 'B202', area: 'Ciencias' },
    { name: 'Matemáticas Avanzadas', profesor: 'Prof. López', salon: 'C303', area: 'Matemáticas' },
    { name: 'Historia Universal', profesor: 'Prof. Martínez', salon: 'D404', area: 'Humanidades' }
  ];
  
  filteredSubjects: { name: string; profesor: string; salon: string; area: string }[] = [];
  selectedArea: string = 'Todas'; // Variable para almacenar el área seleccionada
  draggedSubject: { name: string, profesor: string, salon: string, area: string } | null = null;
  currentCell: HTMLElement | null = null;
  schedule: any[] = []; // Almacena los datos del horario

  constructor(private scheduleService: ScheduleService, private authService: AuthService) {
    this.filteredSubjects = this.subjects; // Inicializa con todas las materias
  }

  ngOnInit() {
    this.loadSchedule(); // Cargar horario al iniciar

  }
  
loadSchedule() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('No se pudo obtener el ID del usuario');
    return;
  }
  console.log('UserID obtenido del localStorage:', userId);

  this.scheduleService.getSchedule(userId).subscribe({
    next: (response: any) => {
      console.log('Horario cargado:', response);
      this.schedule = response.schedule || [];
      this.populateScheduleTable(); // Llena la tabla con los datos cargados
    },
    error: (error) => {
      console.error('Error al cargar el horario:', error);
      alert('Error al cargar el horario');
    }
  });
}
  

  populateScheduleTable() {
    const cells = this.scheduleTable.nativeElement.querySelectorAll<HTMLElement>('td');
    this.schedule.forEach(entry => {
      const hour = entry.hour;
      const dayIndex = entry.day; // Índice del día (ej. 1 para Lunes, 2 para Martes, etc.)
      const subject = entry.subject;
  
      // Busca la celda correspondiente en la tabla
      const row = Array.from(cells).find(cell => {
        return cell.parentElement?.firstElementChild?.textContent === hour;
      });
      
      if (row) {
        const cell = row.parentElement?.children[dayIndex] as HTMLElement;
        if (cell) {
          cell.textContent = subject.name;
          cell.dataset['subject'] = subject.name;
          cell.dataset['profesor'] = subject.profesor;
          cell.dataset['salon'] = subject.salon;
        }
      }
    });
  }
  

  filterSubjectsByArea() {
    if (this.selectedArea === 'Todas') {
      this.filteredSubjects = this.subjects;
    } else {
      this.filteredSubjects = this.subjects.filter(subject => subject.area === this.selectedArea);
    }
  }
  
  ngAfterViewInit() {
    this.loadSchedule(); // Carga el horario desde la API
    const cells = this.scheduleTable.nativeElement.querySelectorAll<HTMLElement>('td');

    // Añadir eventos de arrastrar y soltar a las materias
    document.querySelectorAll<HTMLElement>('.subject').forEach((subject, index) => {
      subject.addEventListener('dragstart', (e: DragEvent) => {
        this.draggedSubject = this.subjects[index];
        e.dataTransfer?.setData('text/plain', this.draggedSubject.name);
      });
    });

    // Añadir eventos de arrastrar y soltar a las celdas de la tabla
    cells.forEach((cell: HTMLElement) => {
      cell.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault();
      });

      cell.addEventListener('drop', () => {
        if (this.draggedSubject) {
          cell.textContent = this.draggedSubject.name;
          cell.dataset['subject'] = this.draggedSubject.name;
          cell.dataset['profesor'] = this.draggedSubject.profesor;
          cell.dataset['salon'] = this.draggedSubject.salon;

          const cellElement = cell as HTMLTableCellElement;

          this.schedule.push({
            hour: cell.parentElement?.firstElementChild?.textContent,
            day: cellElement.cellIndex, // Usando el cast para acceder a cellIndex
            subject: this.draggedSubject
          });
          this.draggedSubject = null;

          
        }
      });

      cell.addEventListener('click', () => {
        if (cell.dataset['subject']) {
          const modal = document.getElementById('subjectModal') as HTMLElement;
          const modalSubject = document.getElementById('modal-subject') as HTMLElement;
          const modalProfesor = document.getElementById('modal-profesor') as HTMLElement;
          const modalSalon = document.getElementById('modal-salon') as HTMLElement;

          modalSubject.textContent = `Materia: ${cell.dataset['subject']}`;
          modalProfesor.textContent = `Profesor: ${cell.dataset['profesor']}`;
          modalSalon.textContent = `Salón: ${cell.dataset['salon']}`;
          modal.style.display = 'block';
          this.currentCell = cell;
        }
      });
    });

    // Cerrar modal
    const modalClose = document.querySelector('.close') as HTMLElement;
    modalClose.addEventListener('click', () => {
      const modal = document.getElementById('subjectModal') as HTMLElement;
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e: MouseEvent) => {
      const modal = document.getElementById('subjectModal') as HTMLElement;
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

     // Eliminar materia del horario
  const removeSubjectButton = document.getElementById('remove-subject') as HTMLElement;
  removeSubjectButton.addEventListener('click', () => {
    if (this.currentCell) {
      const hour = this.currentCell.parentElement?.firstElementChild?.textContent;
      const dayIndex = (this.currentCell as HTMLTableCellElement).cellIndex;
    
      // Encuentra la materia en el horario
      const index = this.schedule.findIndex(
        (entry) => entry.hour === hour && entry.day === dayIndex
      );
    
      if (index !== -1) {
        // Elimina la materia del horario localmente
        this.schedule.splice(index, 1);
    
        // Actualiza el horario en el servidor
        const userId = localStorage.getItem('userId');
        if (!userId) {
          alert('No se pudo obtener el ID del usuario');
          return;
        }
    
        const scheduleData = { userId, schedule: this.schedule };
        this.scheduleService.createSchedule(scheduleData).subscribe({
          next: () => {
            alert('Materia eliminada del horario');
    
            // Limpia la celda visualmente
            this.currentCell!.textContent = ''; // El operador ! asegura que no es nulo
            this.currentCell!.removeAttribute('data-subject');
            this.currentCell!.removeAttribute('data-profesor');
            this.currentCell!.removeAttribute('data-salon');
    
            // Cierra el modal
            const modal = document.getElementById('subjectModal') as HTMLElement;
            modal.style.display = 'none';
          },
          error: (error) => {
            console.error('Error al eliminar la materia del horario:', error);
            alert('Error al eliminar la materia del horario');
          }
        });
      }
    }
  });
  }

  saveSchedule() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('No se pudo obtener el ID del usuario');
      return;
    }
  
    // Datos que se envían al backend
    const scheduleData = { userId, schedule: this.schedule };
    this.scheduleService.createSchedule(scheduleData).subscribe({
      next: (response) => {
        console.log('Horario guardado exitosamente:', response);
        alert('Horario guardado exitosamente');
        
        // Llama al método para cargar el horario actualizado
        this.loadSchedule();
      },
      error: (error) => {
        console.error('Error al guardar el horario:', error);
        alert('Error al guardar el horario');
      }
    });
  }
  
  resetSchedule() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('No se pudo obtener el ID del usuario');
      return;
    }
  
    // Limpia visualmente solo las celdas de materias (sin afectar las horas)
    const rows = this.scheduleTable.nativeElement.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      const cells = Array.from(row.children).slice(1); // Omitir la primera celda (hora)
      cells.forEach((cell) => {
        const htmlCell = cell as HTMLElement; // Asegura que se trate como HTMLElement
        htmlCell.textContent = '';
        htmlCell.removeAttribute('data-subject');
        htmlCell.removeAttribute('data-profesor');
        htmlCell.removeAttribute('data-salon');
      });
    });
  
    // Limpia el estado local
    this.schedule = [];
  
    // Actualiza el horario en el servidor
    const scheduleData = { userId, schedule: this.schedule };
    this.scheduleService.createSchedule(scheduleData).subscribe({
      next: () => {
        alert('Horario reiniciado exitosamente');
      },
      error: (error) => {
        console.error('Error al reiniciar el horario:', error);
        alert('Error al reiniciar el horario');
      },
    });
  }
  
  generatePDF() {
    const doc = new jsPDF();

    // Encabezado estilizado
    doc.setFillColor(33, 150, 243); // Color azul
    doc.rect(0, 0, 210, 20, 'F'); // Rectángulo de fondo
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.text('Horario de Clases', 105, 12, { align: 'center' });

    // Convertir la tabla en una imagen
    const scheduleTableElement = this.scheduleTable.nativeElement;
    html2canvas(scheduleTableElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190; // Ancho de la imagen en el PDF
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Escalar altura
        const marginX = (pageWidth - imgWidth) / 2; // Centrado horizontal

        // Añadir la tabla como imagen
        doc.addImage(imgData, 'PNG', marginX, 30, imgWidth, imgHeight);

        // Información detallada de las materias
        let detailsStartY = 30 + imgHeight + 20; // Espacio debajo de la tabla
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Cambiar el texto a negro
        doc.text('Información detallada de las materias seleccionadas', 105, detailsStartY, { align: 'center' });

        detailsStartY += 10; // Espacio debajo del título

        // Array de días de la semana
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

        // Verificar si hay materias seleccionadas
        if (this.schedule.length > 0) {
            // Preparar datos para la tabla
            const tableBody = this.schedule.map((entry) => [
                entry.hour,
                dayNames[entry.day - 1],
                entry.subject.name,
                entry.subject.profesor,
                entry.subject.salon,
            ]);

            // Añadir la tabla de información detallada
            (doc as any).autoTable({
                head: [['Hora', 'Día', 'Materia', 'Profesor', 'Salón']],
                body: tableBody,
                startY: detailsStartY,
                theme: 'striped',
                styles: {
                    halign: 'center',
                    valign: 'middle',
                },
                headStyles: {
                    fillColor: [33, 150, 243],
                    textColor: [255, 255, 255],
                    fontSize: 10,
                },
            });
        } else {
            // Mensaje de no hay materias seleccionadas
            doc.setFontSize(10);
            doc.text('No hay materias seleccionadas para mostrar.', 105, detailsStartY, { align: 'center' });
        }

        // Pie de página
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generado el: ${new Date().toLocaleDateString()} | Sistema de Gestión de Horarios`, 105, 290, { align: 'center' });

        // Descargar PDF
        doc.save('Horario_Clases.pdf');
    });
}

  
  
  
}
