import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([
   {
    id: Date.now(),
    title:'Learn Angular',
    completed: false,
   },
  ]);

_getTask() {
  return this.tasks()
}
  changeHandler(event: Event) {
    const elementInput = event.target as HTMLInputElement;
    const newTask = elementInput.value;
    this.addTask(newTask)

  }
  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false
    }
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  markCompleted(id: number) {
    this.tasks.update((tasks) => tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task)
    )
    console.log(this._getTask())
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index))
  }
}
