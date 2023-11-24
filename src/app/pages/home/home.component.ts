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

  tasks = signal<Task[]>([]); // initial array of task

  // filter the task
  filter = signal<'all' | 'pending' | 'completed'>('all');

  tasksByFilter = computed(() => {
    // computed create a new signal based on another signals
    const filter = this.filter(); // 'all' | 'pending' | 'completed'
    const tasks = this.tasks(); // Task[]
    // filter by pending task
    if(filter === 'pending') {
      return tasks.filter(task => !task.completed)
    }
    // filter by completed task
    else if(filter === 'completed') {
      return tasks.filter(task => task.completed)
    }
    // return al the task by default
    return tasks;
  });

  // control the input of new task
  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
    ],
  });

  injector = inject(Injector);

  // the initial state of the tasks
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
      // effect vigilates everytime a state(signal) change
      // and allow to execute a logic based on that or those changes
      // usually is used inside a contructor
      // it's executed everytime thre is a change on the state(signal) place inside
      const tasks = this.tasks();
      localStorage.setItem('TASKS_ANGULAR_V1', JSON.stringify(tasks)); //make the storage a string
    },
    {
      injector: this.injector,
    } // this option is added if the  effect is called out of a constructor
    );
  }

  // handle edit the new task with the double click
  changeHandler() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      if (value !== '') {
        this.addTask(value);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  // schema to create a new task
  // check folder /models for types
  addTask(title: string) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  // mark task as completed
  markCompleted(id: string) {
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

  // update task
  updateTask(id: string) {
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

  updateTaskHandler(id: string, event: Event) {
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


  deleteTask(id: string) {
    this.tasks.update((tasks) =>
      tasks.filter((task) => task.id !== id)
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
