import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { AssignmentsService } from '../../services/assignments.service'; // Asegúrate de que la ruta sea correcta
import { MatDialog } from '@angular/material/dialog';
import { AssignmentDetailsModalComponent } from '../assignment-details-modal/assignment-details-modal.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HeaderComponent, FooterComponent],
  providers: [DatePipe],  // Asegúrate de agregar esto
  templateUrl: './asignaciones.component.html',
  styleUrl: './asignaciones.component.css'
})
export class AsignacionesComponent implements OnInit {
  tasks: any[] = []; // Lista de asignaciones
  filteredTasks: any[] = []; // Lista de asignaciones filtradas
  editingTask: any = null; // Tarea en edición
  isModalOpen = false; // Controla si el modal está abierto
  selectedTask: any = null; // Almacena la tarea seleccionada
  today: string = new Date().toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD

  filters = {
    search: '',
    tipo: '',
    prioridad: '',
    fecha: '',
    course: '', // Agregamos esta línea
  };

  // Nuevas tareas
  taskTitle: string = '';
  taskDescription: string = '';
  taskDueDate: string = '';
  taskPriority: string = '';
  taskType: string = '';
  taskCourse: string = '';

  constructor(private assignmentsService: AssignmentsService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadTasks();
  }

// Simplificación del llamado
loadTasks(): void {
  this.assignmentsService.getAssignments().subscribe(
    (tasks) => {
      console.log('Tareas recibidas:', tasks); // Verifica lo que recibes
      this.tasks = tasks.map(task => {
        task.dueDate = this.datePipe.transform(task.dueDate, 'dd/MM/yyyy'); // Formatear la fecha aquí
        return task;
      });
      this.filteredTasks = [...this.tasks]; // Copia las tareas iniciales para los filtros
    },
    (error) => {
      console.error('Error al cargar las asignaciones:', error);
    }
  );
}




  // Crear una nueva tarea
  createTask(): void {
      // Verificamos si ya existe una tarea con el mismo título
  const taskExists = this.tasks.some(task => task.title.toLowerCase() === this.taskTitle.toLowerCase());

  if (taskExists) {
    alert('Ya existe una asignación con el mismo nombre. Por favor, elige otro título.');
    return; // No permitimos crear la tarea si ya existe
  }
      // Verificamos si la fecha de vencimiento es válida
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);  // Restar un día
      
      // Formateamos la fecha para compararla con la fecha de vencimiento
      const todayFormatted = today.toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD
      const yesterdayFormatted = yesterday.toISOString().split('T')[0]; // Fecha de ayer en formato YYYY-MM-DD
      
      // Verificar si la fecha de vencimiento es válida (permitiendo hasta ayer)
      if (this.taskDueDate < yesterdayFormatted) {
        alert('La fecha de vencimiento debe ser hoy o ayer.');
        return;
      }

   // Formateamos la fecha de vencimiento para que solo tenga el formato DD/MM/YYYY
   const formattedDueDate = this.datePipe.transform(this.taskDueDate, 'yyyy-MM-dd'); // Formato sin hora


    const newTask = {
      title: this.taskTitle,
      description: this.taskDescription,
    dueDate: this.datePipe.transform(this.taskDueDate, 'yyyy-MM-dd'), // Formatear fecha sin hora (YYYY-MM-DD)
      priority: this.taskPriority,
      type: this.taskType,
      course: this.taskCourse,
    };

    this.assignmentsService.createAssignment(newTask).subscribe(
      (task) => {
        this.tasks.push(task);
        this.filteredTasks.push(task); // Agrega a la lista filtrada para que se muestre de inmediato
        this.resetForm();
      },
      (error) => {
        console.error('Error al crear la asignación:', error);
      }
    );
  }

  
  // Eliminar una tarea
deleteTask(taskId: string): void {
  this.assignmentsService.deleteAssignment(taskId).subscribe(
    (response) => {
      console.log('Tarea eliminada correctamente:', response); // Verifica que la respuesta sea exitosa
      // Filtra la tarea eliminada de la lista de tareas
      this.tasks = this.tasks.filter((task) => task._id !== taskId);
       // Actualiza la lista filtrada eliminando la tarea
       this.filteredTasks = this.filteredTasks.filter((task) => task._id !== taskId);
    },
    (error) => {
      console.error('Error al eliminar la asignación:', error);
      // Aquí podrías agregar un mensaje al usuario si es necesario
    }
  );
}


startEdit(task: any): void {
  this.editingTask = { ...task }; // Copia la tarea para edición
}

saveEdit(): void {
  if (this.editingTask) {
    this.assignmentsService.updateAssignment(this.editingTask._id, this.editingTask).subscribe(
      (updatedTask) => {
        console.log('Tarea actualizada correctamente:', updatedTask);

        // Actualiza la lista principal
        const index = this.tasks.findIndex((task) => task._id === updatedTask._id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }

        // Actualiza la lista filtrada si es necesario
        const filteredIndex = this.filteredTasks.findIndex((task) => task._id === updatedTask._id);
        if (filteredIndex !== -1) {
          this.filteredTasks[filteredIndex] = updatedTask;
        }

        // Limpia la tarea en edición
        this.editingTask = null;
      },
      (error) => {
        console.error('Error al actualizar la asignación:', error);
      }
    );
  }
}


cancelEdit(): void {
  this.editingTask = null; // Cancela la edición
}

openModal(task: any): void {
  console.log('Tarea seleccionada:', task); // Verifica si la tarea seleccionada llega correctamente
  this.selectedTask = task; // Establece la tarea seleccionada
  this.isModalOpen = true; // Muestra el modal
}


closeModal(): void {
  this.isModalOpen = false; // Oculta el modal
  this.selectedTask = null; // Limpia la tarea seleccionada
}

  // Método para aplicar los filtros sin llamar al backend nuevamente
  applyFilters(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesSearch =
        this.filters.search === '' || task.title.toLowerCase().includes(this.filters.search.toLowerCase());
      const matchesCourse =
        this.filters.course === '' || task.course.toLowerCase().includes(this.filters.course.toLowerCase());
      const matchesTipo = this.filters.tipo === '' || task.type === this.filters.tipo;
      const matchesPrioridad = this.filters.prioridad === '' || task.priority === this.filters.prioridad;
  
       // Convertir la fecha de la tarea en un objeto Date
       const taskDate = new Date(task.dueDate);
       taskDate.setHours(0, 0, 0, 0);  // Asegurarse de que solo se compare la fecha, no la hora
   
       // Obtener la fecha actual y restablecerla a las 00:00:00
       const today = new Date();
       today.setHours(0, 0, 0, 0);  // Establecer la hora a 00:00:00 para comparar solo las fechas
   
       let matchesFecha = true;
       if (this.filters.fecha === 'mas_reciente') {
         // Mostrar tareas cuya fecha sea hoy o en el futuro
         matchesFecha = taskDate >= today;
       } else if (this.filters.fecha === 'mas_lejana') {
         // Mostrar tareas cuya fecha ya haya pasado
         matchesFecha = taskDate < today;
       }
   
       return matchesSearch && matchesCourse && matchesTipo && matchesPrioridad && matchesFecha;
     });
   }
  

// Método para limpiar los filtros y mostrar todas las tareas
clearFilters(): void {
  this.filters = {
    search: '',
    tipo: '',
    prioridad: '',
    fecha: '',
    course: '', // Agregamos esta línea
  };
  this.filteredTasks = [...this.tasks]; // Restablece a todas las tareas
}

  // Reiniciar el formulario
  resetForm(): void {
    this.taskTitle = '';
    this.taskDescription = '';
    this.taskDueDate = '';
    this.taskPriority = '';
    this.taskType = '';
    this.taskCourse = '';
  }

   // Cambiar el estado de completado de la asignación
   toggleCompleted(assignment: any): void {
    // Invertimos el estado de 'completed'
    const updatedCompleted = !assignment.completed;
  
    // Llamamos al servicio para actualizar el estado de la asignación en el backend
    this.assignmentsService.updateCompleted(assignment._id, updatedCompleted).subscribe(
      (updatedAssignment) => {
        // Si el backend responde correctamente, actualizamos el estado de la asignación en el frontend
        assignment.completed = updatedAssignment.completed;
      },
      (error) => {
        console.error('Error al actualizar la asignación:', error);
        // Revertimos el cambio si ocurrió un error en la actualización
        assignment.completed = !updatedCompleted;
  
        // Opcional: Notificar al usuario sobre el error
        alert('No se pudo actualizar el estado de la asignación. Por favor, intente nuevamente.');
      }
    );
  }
  
}