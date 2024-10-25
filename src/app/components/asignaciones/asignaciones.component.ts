import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './asignaciones.component.html',
  styleUrl: './asignaciones.component.css'
})
export class AsignacionesComponent {
  username: string | null = null;
  tasks = []; 
  taskTitle: string = '';
  taskDescription: string = '';
  taskDueDate: string = '';
  taskPriority: string = '';
  taskType: string = '';
  taskCourse: string = '';
  searchInput: string = '';
  taskTypeFilter: string = '';
  taskPriorityFilter: string = '';
  taskDateFilter: string = '';

  constructor() {}

  onSubmitTask() {
  }

  onSearchTask() {
  }

  markTaskAsCompleted(taskId: number) {
  }

  openTask(taskId: number) {
  }

  editTask(taskId: number) {
  }

  deleteTask(taskId: number) {
  }

  logout() {
  }
}