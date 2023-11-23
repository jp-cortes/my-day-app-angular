import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  moto = 'I get around';
  todos = [
    'Todo 1',
    'Todo 2',
    'Todo 3',
  ];
  name = 'Jhonny';
  age = 20;
  disabled = true;
  person = signal({
    avatar: 'https://w3schools.com/howto/img_avatar.png',
    alt: 'avatar',
    name: 'Jhonny',
    age: 20
  })

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,
  });
  nameCtrl = new FormControl('Jhonny', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
    ]
  });

  constructor() {
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);
    })
  }

  clickHandler() {
    alert('single click');
  }

  doubleClickHandler() {
    alert('double click');
  }


  newAge = signal('');
  tasks = signal([
    'Todo 1',
    'Todo 2',
    'Todo 3',
  ]);

  changeHandler(event: Event) {
    const elementInput = event.target as HTMLInputElement
    this.newAge.set(elementInput.value);

  }
  addTask(event: Event) {
    const elementInput = event.target as HTMLInputElement;
    const newTask = elementInput.value;
    this.tasks.update((tasks) => [...tasks, newTask]);

  }

  keyupHandler(event: Event) {
    const elementInput = event.target as HTMLInputElement
    console.log(elementInput.value);

  }

  changeAge(event: Event) {
    const elementInput = event.target as HTMLInputElement;
    const newValue = elementInput.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        age: Number(newValue)
      }
    });
  }

  changeName(event: Event) {
    const elementInput = event.target as HTMLInputElement;
    const newValue = elementInput.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        name: newValue
      }
    });
  }



}
