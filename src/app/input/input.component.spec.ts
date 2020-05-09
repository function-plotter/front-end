import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { InputComponent, DEFAULT_RANGE, VariableRange } from './input.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { AppModule } from '../app.module';
import { By } from '@angular/platform-browser';
import { type } from 'os';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let dEl: DebugElement;
  let lbInput: HTMLInputElement;
  let ubInput: HTMLInputElement;
  let stepInput: HTMLInputElement;

  /**
   * type new value in the specified input
   * and emit the input event
   */
  const typeValue = (input: HTMLInputElement, value: number) => {
    input.value = value.toString();
    input.dispatchEvent(new Event('input'));
  };

  /** query for the error container debug element */
  const getErrorDE = () => dEl.query(By.css('.error-container'));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    dEl = fixture.debugElement;
    lbInput = dEl.query(By.css('#lowerBound')).nativeElement as HTMLInputElement;
    ubInput = dEl.query(By.css('#upperBound')).nativeElement as HTMLInputElement;
    stepInput = dEl.query(By.css('#step')).nativeElement as HTMLInputElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the group with default input range', () => {
    expect(component.group.value).toEqual(DEFAULT_RANGE);
  });

  it('should display the default range via inputs', () => {
    expect(lbInput.value).toBe('' + DEFAULT_RANGE.lowerBound);
    expect(ubInput.value).toBe('' + DEFAULT_RANGE.upperBound);
    expect(stepInput.value).toBe('' + DEFAULT_RANGE.step);
  });

  it('should emit new range on input change', async(() => {
    const newLb = -100;

    component.rangeChange.subscribe((range: VariableRange) => {
      expect(range.lowerBound).toBe(newLb);
    });

    typeValue(lbInput, newLb);
  }));

  it('should not display the error message if no error is triggered', () => {
    typeValue(lbInput, -100);
    typeValue(ubInput, 100);
    typeValue(stepInput, 1);

    fixture.detectChanges();

    const errorContainer = dEl.query(By.css('.error-container'));
    expect(errorContainer).toBe(null);
  });

  it('should trigger range error if lowerBound >= upperBound', () => {
    typeValue(lbInput, DEFAULT_RANGE.upperBound);
    typeValue(ubInput, DEFAULT_RANGE.upperBound);

    expect(component.group.errors.invalidRange).toBe(true);
  });

  it('should trigger step error if step > upperBound - lowerBound', () => {
    typeValue(stepInput, -1);

    expect(component.group.errors.invalidStep).toBe(true);
  });

  it('should display error message if validation error is present', () => {
    component.group.setErrors({ someError: true });

    fixture.detectChanges();

    const errorDiv = dEl.query(By.css('.error-container')).nativeElement as HTMLDivElement;
    expect(errorDiv.textContent.toLowerCase()).toContain('invalid range');
  });

  it('should not emit new values if validation error is triggered', fakeAsync(() => {
    const callback = jasmine.createSpy('callback');
    component.rangeChange.subscribe(callback);

    typeValue(stepInput, -1);
    tick(100);

    expect(callback).not.toHaveBeenCalled();
  }));

  it('should hide error message if the error is fixed', () => {
    typeValue(lbInput, -1);
    typeValue(ubInput, 1);
    typeValue(stepInput, 3);
    fixture.detectChanges();

    const errorContainer = getErrorDE().nativeElement as HTMLDivElement;
    expect(errorContainer.textContent.toLowerCase()).toContain('invalid range');

    typeValue(lbInput, -4);
    fixture.detectChanges();

    expect(getErrorDE()).toBe(null);
  });
});
