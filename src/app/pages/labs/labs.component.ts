import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  moto = 'I get around';
  task = [
    'Todo 1',
    'Todo 2',
    'Todo 3',
  ]
  name = 'Jhonny';
  age = 20;
  disabled = true;
  person = {
    avatar: 'https://w3schools.com/howto/img_avatar.png',
    alt: 'avatar',
    name: 'Jhonny',
    age: 20
  }
  clickHandler() {
    alert('single click');
  }

  doubleClickHandler() {
    alert('double click');
  }


  newAge = signal('');

  changeHandler(event: Event) {
    const elementInput = event.target as HTMLInputElement
    this.newAge.set(elementInput.value);

  }

  keyupHandler(event: Event) {
    const elementInput = event.target as HTMLInputElement
    console.log(elementInput.value);

  }
}
