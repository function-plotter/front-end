import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors } from '@angular/forms';

export interface VariableRange {
  lowerBound: number;
  upperBound: number;
  step: number;
}

export const DEFAULT_RANGE: VariableRange = {
  lowerBound: -5,
  upperBound: 5,
  step: 1,
};

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Output() rangeChange = new EventEmitter<VariableRange>();

  group: FormGroup;

  // keep a snapshot of current range so we can make sure to emit
  // just the new changes, as inputs emit changes at blur event
  // (last value is emitted twice)
  private rangeSnapshot = DEFAULT_RANGE;

  constructor() {}

  // validate that the lower bound is not greater than the upper bound
  rangeBoundsValidator(group: FormGroup): ValidationErrors | null {
    const min = group.get('lowerBound').value;
    const max = group.get('upperBound').value;
    if (min === null || max === null || min >= max) {
      return { invalidRange: true };
    }
    return null;
  }

  // make sure that the step is not too great so we can have
  // at least one value inside the range
  stepValidator(group: FormGroup): ValidationErrors | null {
    const min = group.get('lowerBound');
    const max = group.get('upperBound');
    const step = group.get('step');
    if (step.value > max.value - min.value) {
      return { invalidStep: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.group = new FormGroup(
      {
        lowerBound: new FormControl(),
        upperBound: new FormControl(),
        step: new FormControl(),
      },
      [this.rangeBoundsValidator, this.stepValidator],
    );
    // subscribe to changes to emit new ranges
    this.group.valueChanges.subscribe((newRange: VariableRange) => {
      if (this.group.errors) {
        return;
      }

      if (JSON.stringify(newRange) === JSON.stringify(this.rangeSnapshot)) {
        return;
      }

      this.rangeSnapshot = newRange;
      this.rangeChange.emit(newRange);
    });
    // set the default value for the form group
    this.group.setValue(DEFAULT_RANGE);
  }
}
