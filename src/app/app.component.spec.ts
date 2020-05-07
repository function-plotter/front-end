import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SolverService } from './shared/services/solver.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DEFAULT_NODE, TreeNode } from './tree/tree-node/tree-node.component';
import { DEFAULT_RANGE, VariableRange } from './input/input.component';
import { FunctionType } from './shared/models/Function';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let solverSpy: { solve: jasmine.Spy };

  beforeEach(async(() => {
    solverSpy = jasmine.createSpyObj('SolverService', ['solve']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [{ provide: SolverService, useValue: solverSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should call solver.solve with default values after init', () => {
    app.ngOnInit();

    const solverArgs = solverSpy.solve.calls.first().args;

    expect(solverArgs[0]).toEqual(DEFAULT_NODE, 'default function');
    expect(solverArgs[1]).toEqual(DEFAULT_RANGE, 'default range');
  });

  it('should call solver.solve with new range after range change', () => {
    const customRange: VariableRange = { lowerBound: -1, step: 0.1, upperBound: 1 };
    app.onRangeChange(customRange);

    const solverArgs = solverSpy.solve.calls.first().args;

    expect(solverArgs[0]).toEqual(DEFAULT_NODE);
    expect(solverArgs[1]).toEqual(customRange);
  });

  it('should call solver.solve with new function after function change', () => {
    const customFunc: TreeNode = { type: FunctionType.CONSTANT, value: 10 };
    app.onFunctionChange(customFunc);

    const solverArgs = solverSpy.solve.calls.first().args;
    expect(solverArgs[0]).toEqual(customFunc);
    expect(solverArgs[1]).toEqual(DEFAULT_RANGE);
  });

  it('should call solver.solve with the last function and range when they change', () => {
    const customRange: VariableRange = { lowerBound: -4, step: 0.05, upperBound: 100 };
    const customFunc: TreeNode = {
      type: FunctionType.ADDITION,
      args: [
        { type: FunctionType.CONSTANT, value: 1 },
        { type: FunctionType.CONSTANT, value: 3 },
      ],
    };

    app.onFunctionChange(customFunc);
    let solverArgs = solverSpy.solve.calls.mostRecent().args;
    expect(solverArgs).toEqual([customFunc, DEFAULT_RANGE]);

    app.onRangeChange(customRange);
    solverArgs = solverSpy.solve.calls.mostRecent().args;
    expect(solverArgs).toEqual([customFunc, customRange]);
  });
});
