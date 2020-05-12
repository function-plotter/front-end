import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GraphicComponent } from './graphic.component';
import { By } from '@angular/platform-browser';
import { FunctionType } from '../shared/models/Function';

describe('GraphicComponent', () => {
  let fixture: ComponentFixture<GraphicComponent>;
  let component: GraphicComponent;
  let solverSpy: jasmine.Spy;

  beforeEach(async(() => {
    solverSpy = jasmine.createSpyObj('SolverService', ['solve']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GraphicComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(GraphicComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should call zoom in function when pressed', fakeAsync(() => {
    spyOn(component, 'zoomIn');

    const button = fixture.debugElement.nativeElement.querySelector('button#zoomIn');
    button.click();
    tick();
    expect(component.zoomIn).toHaveBeenCalled();
  }));

  it('should call zoom out function when pressed', fakeAsync(() => {
    spyOn(component, 'zoomOut');

    const button = fixture.debugElement.nativeElement.querySelector('button#zoomOut');
    button.click();
    tick();
    expect(component.zoomOut).toHaveBeenCalled();
  }));

  it('should call download png function when pressed', fakeAsync(() => {
    spyOn(component, 'downloadPNG');

    const button = fixture.debugElement.nativeElement.querySelector('button#downloadPNG');
    button.click();
    tick();
    expect(component.downloadPNG).toHaveBeenCalled();
  }));

  it('should call download csv function when pressed', fakeAsync(() => {
    spyOn(component, 'downloadCSV');

    const button = fixture.debugElement.nativeElement.querySelector('button#downloadCSV');
    button.click();
    tick();
    expect(component.downloadCSV).toHaveBeenCalled();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createGraphic on Init', fakeAsync(() => {
    spyOn(component, 'createGraphic');
    fixture.detectChanges();
    expect(component.createGraphic).toHaveBeenCalled();
  }));

  it('zoom Graph was called when zoomIn', () => {
    spyOn(component, 'zoomGraph');
    component.virtualScale = 1.0;
    component.maxScale = 5;
    component.zoomIn();
    expect(component.zoomGraph).toHaveBeenCalled();
  });

  it('zoom Graph was not called when zoomIn', () => {
    spyOn(component, 'zoomGraph');
    component.virtualScale = 5.1;
    component.maxScale = 5;
    component.zoomIn();
    expect(component.zoomGraph).not.toHaveBeenCalled();
  });

  it('zoom Graph was called when zoomOut', () => {
    spyOn(component, 'zoomGraph');
    component.virtualScale = 1.0;
    component.minScale = 0.3;
    component.zoomOut();
    expect(component.zoomGraph).toHaveBeenCalled();
  });

  it('zoom Graph was not called when zoomOut', () => {
    spyOn(component, 'zoomGraph');
    component.virtualScale = 1.0;
    component.minScale = 1.1;
    component.zoomOut();
    expect(component.zoomGraph).not.toHaveBeenCalled();
  });

  it('should call createGraphic when zoomGraph is called', () => {
    spyOn(component, 'createGraphic');
    component.zoomGraph();
    expect(component.createGraphic).toHaveBeenCalled();
  });

  it('should call renderFunction when zoomGraph is called', () => {
    spyOn(component, 'renderFunction');
    component.zoomGraph();
    expect(component.renderFunction).toHaveBeenCalled();
  });

  it('should not call createGraphic when solution is null', () => {
    spyOn(component, 'createGraphic');
    component.handleSolutionChange(null, [], null);
    expect(component.createGraphic).not.toHaveBeenCalled();
  });

  it('should not call renderFunction when solution is null', () => {
    spyOn(component, 'renderFunction');
    component.handleSolutionChange(null, [], null);
    expect(component.renderFunction).not.toHaveBeenCalled();
  });

  it('should call createGraphic when solution has value', () => {
    spyOn(component, 'createGraphic');
    const solution = [{ x: 2, y: 3 }];
    const func = { type: FunctionType.ADDITION };
    const ctx = component.canvas.nativeElement.getContext('2d');
    component.handleSolutionChange(ctx, solution, func);
    expect(component.createGraphic).toHaveBeenCalled();
  });

  it('should call createGraphic when solution has value', () => {
    spyOn(component, 'renderFunction');
    const solution = [{ x: 2, y: 3 }];
    const func = { type: FunctionType.ADDITION };
    const ctx = component.canvas.nativeElement.getContext('2d');
    component.handleSolutionChange(ctx, solution, func);
    expect(component.renderFunction).toHaveBeenCalled();
  });

  it('should call drawAx when createGraphic is called', () => {
    spyOn(component, 'drawAx');
    const ctx = component.canvas.nativeElement.getContext('2d');
    component.createGraphic(ctx);
    expect(component.drawAx).toHaveBeenCalled();
  });

  it('should call drawAx when createGraphic is called', () => {
    spyOn(component, 'drawXTickMarks');
    component.maxX = 3;
    const ctx = component.canvas.nativeElement.getContext('2d');
    component.createGraphic(ctx);
    expect(component.drawXTickMarks).toHaveBeenCalled();
  });

  it('should call drawAx when createGraphic is called', () => {
    spyOn(component, 'drawYTickMarks');
    component.maxY = 3;
    const ctx = component.canvas.nativeElement.getContext('2d');
    component.createGraphic(ctx);
    expect(component.drawYTickMarks).toHaveBeenCalled();
  });

  it('should call XC when drawAx is called', () => {
    spyOn(component, 'XC');
    const ctx = component.canvas.nativeElement.getContext('2d');
    component.drawAx(ctx, 5, 7);
    expect(component.XC).toHaveBeenCalled();
  });

  it('should call YC when drawAx is called', () => {
    spyOn(component, 'YC');
    const ctx = component.canvas.nativeElement.getContext('2d');
    component.drawAx(ctx, 5, 7);
    expect(component.YC).toHaveBeenCalled();
  });

  it('should call clearRect when zoomGraph is called', () => {
    spyOn(component.canvas.nativeElement.getContext('2d'), 'clearRect');
    component.zoomGraph();
    expect(component.canvas.nativeElement.getContext('2d').clearRect).toHaveBeenCalled();
  });

  it('should draw integral when  function type is integral', () => {
    spyOn(component.canvas.nativeElement.getContext('2d'), 'restore');
    const solution = [
      { x: 1, y: 3 },
      { x: 2, y: 5 },
    ];
    const ctx = component.canvas.nativeElement.getContext('2d');
    component.lastFunc = { type: FunctionType.INTEGRAL, range: [1, 2] };
    component.renderFunction(ctx, solution);
    expect(component.canvas.nativeElement.getContext('2d').restore).toHaveBeenCalled();
  });

  it('should call moveTo when firstPoint is true', () => {
    spyOn(component.canvas.nativeElement.getContext('2d'), 'lineTo');
    const solution = [
      { x: 1, y: 3 },
      { x: 2, y: 5 },
    ];
    const ctx = component.canvas.nativeElement.getContext('2d');
    component.lastFunc = { type: FunctionType.INTEGRAL, range: [1, 2] };
    component.firstPoint = false;
    component.renderFunction(ctx, solution);
    expect(component.canvas.nativeElement.getContext('2d').lineTo).toHaveBeenCalled();
  });

  it('calculate XC', () => {
    component.minX = 0;
    component.maxX = 5;
    component.width = 500;
    const result = component.XC(5);
    expect(result).toBe(500);
  });

  it('calculate YC', () => {
    component.minY = 0;
    component.maxY = 5;
    component.height = 500;
    const result = component.YC(5);
    expect(result).toBe(0);
  });

  it('should download csv file', () => {
    spyOn(URL, 'revokeObjectURL');
    component.lastSolution = [{ x: 2, y: 4 }];
    component.downloadCSV();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('should download png file', fakeAsync(() => {
    spyOn(HTMLElement.prototype, 'click');
    component.downloadPNG();
    expect(HTMLElement.prototype.click).toHaveBeenCalled();
  }));
});
