import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  group: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.group = new FormGroup({
      lowerBound: new FormControl(0),
      upperBound: new FormControl(1),
      step: new FormControl(0.1),
    });
  }
}
