import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title: 'Learn Angular',
      completed: false,
    },
  ]);

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  getTask() {
    return this.tasks();
  }

  changeHandler() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      if (value !== '') {
        this.addTask(value);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  markCompleted(id: number) {
    this.tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task
      })
    );
  }

  updateTask(id: number) {
    this.tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            editing: true,
          };
        }
        return {
          ...task,
          editing: false,
        };
      })
    );
  }

  updateTaskHandler(id: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) =>
      tasks.map((task) => {
        const updatedTitle = input.value.trim()
        if (task.id === id && updatedTitle !== '') {
          return {
            ...task,
            title: updatedTitle ,
            editing: false,
          };
        }
        return task;
      })
    );
  }


  deleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((task, position) => position !== index)
    );
  }
  clearCompletedTask() {
    this.tasks.update((tasks) =>
      tasks.filter((task) => task.completed === false)
    );
  }
}
