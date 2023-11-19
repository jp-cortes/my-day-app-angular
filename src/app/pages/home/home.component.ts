import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal([
    'Todo 1',
    'Todo 2',
    'Todo 3',
  ]);

  addTask(event: Event) {
    const elementInput = event.target as HTMLInputElement;
    const newTask = elementInput.value;
    this.tasks.update((tasks) => [...tasks, newTask]);

  }
  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index))
  }
}
