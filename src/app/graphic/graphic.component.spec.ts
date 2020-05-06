import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicComponent } from './graphic.component';
import { SolverService } from '../shared/services/solver.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GraphicComponent', () => {
  let fixture: ComponentFixture<GraphicComponent>;
  let graphic: GraphicComponent;
  let solverSpy: jasmine.Spy;

  beforeEach(async(() => {
    solverSpy = jasmine.createSpyObj('SolverService', ['solve']);

    TestBed.configureTestingModule({
      declarations: [GraphicComponent],
      providers: [{ provide: SolverService, useValue: solverSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphicComponent);
    graphic = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(graphic).toBeTruthy();
  });
});
