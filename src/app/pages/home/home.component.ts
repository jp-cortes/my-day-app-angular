import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
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

  tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');

  tasksByFilter = computed(() => {
    // computed is use to handle multiple signals
    const filter = this.filter();
    const tasks = this.tasks();
    if(filter === 'pending') {
      return tasks.filter(task => !task.completed)
    }
    else if(filter === 'completed') {
      return tasks.filter(task => task.completed)
    }
    return tasks;
  });

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  injector = inject(Injector);

    ngOnInit() {
      const storage = localStorage.getItem('TASKS_ANGULAR_V1')
      if(storage) {
        const tasks = JSON.parse(storage); // make the string an array of object again
        this.tasks.set(tasks);
      }
      this.trackTask();
    }

  trackTask() {
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('TASKS_ANGULAR_V1', JSON.stringify(tasks)); //make the storage a string
    },
    {
      injector: this.injector
    } // this option is added if the  effect is called out of a constructor
    );
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

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }

  clearCompletedTask() {
    this.tasks.update((tasks) =>
      tasks.filter((task) => task.completed === false)
    );
  }
}
