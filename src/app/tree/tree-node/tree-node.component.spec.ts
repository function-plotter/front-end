import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { FunctionType } from 'src/app/shared/models/Function';
import { DEFAULT_NODE, TreeNode, TreeNodeComponent } from './tree-node.component';

describe('TreeNodeComponent', () => {
  let component: TreeNodeComponent;
  let fixture: ComponentFixture<TreeNodeComponent>;
  let de: DebugElement;

  const getInput = (id: string) => {
    const constInputDe = de.query(By.css(id));
    return constInputDe ? (constInputDe.nativeElement as HTMLInputElement) : null;
  };

  const typeInput = (input: HTMLInputElement, value: number) => {
    input.value = value.toString();
    input.dispatchEvent(new Event('input'));
  };

  const getArguments = () => {
    const argumentsContainerDe = de.query(By.css('.function-arguments-container'));
    if (!argumentsContainerDe) {
      return [];
    }
    const argumentElements = argumentsContainerDe.queryAll(By.css('app-tree-node'));
    return argumentElements.map((argDe) => argDe.componentInstance);
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNodeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init with default node', () => {
    expect(component.node).toEqual(DEFAULT_NODE);
  });

  it('should init available types', () => {
    fixture.detectChanges();
    expect(component.availableTypes.sort()).toEqual(Object.values(FunctionType).sort());
  });

  it('should init available types when exclude input is specified', () => {
    const exclude: FunctionType[] = [FunctionType.INTEGRAL];
    const expectedAvailableTypes: FunctionType[] = Object.values(FunctionType).filter(
      (fType) => fType !== FunctionType.INTEGRAL,
    );

    component.exclude = exclude;
    fixture.detectChanges();

    expect(component.availableTypes.sort()).toEqual(expectedAvailableTypes.sort());
  });

  it('should init available types when accepts input is specified', () => {
    const accepts: FunctionType[] = Object.values(FunctionType).filter((fType) => fType !== FunctionType.INTEGRAL);
    const expectedAvailableTypes: FunctionType[] = Object.values(FunctionType).filter(
      (fType) => fType !== FunctionType.INTEGRAL,
    );

    component.accepts = accepts;
    fixture.detectChanges();

    expect(component.accepts.sort()).toEqual(expectedAvailableTypes.sort());
  });

  it('should init available types when accepts and exclude inputs are specified', () => {
    const accepts: FunctionType[] = [FunctionType.ADDITION, FunctionType.COS, FunctionType.SIN];
    const exclude: FunctionType[] = [FunctionType.ADDITION];
    const expectedAvailableTypes: FunctionType[] = [FunctionType.COS, FunctionType.SIN];

    component.accepts = accepts;
    component.exclude = exclude;
    fixture.detectChanges();

    expect(component.availableTypes.sort()).toEqual(expectedAvailableTypes.sort());
  });

  it('should change function type with default function as arguments', () => {
    fixture.detectChanges();

    const expectedFunction: TreeNode = {
      type: FunctionType.ADDITION,
      args: [DEFAULT_NODE, DEFAULT_NODE],
    };

    component.typeChange(FunctionType.ADDITION);

    expect(component.node).toEqual(expectedFunction);
  });

  it('should change function arguments', () => {
    fixture.detectChanges();

    component.typeChange(FunctionType.ADDITION);

    const newArgument: TreeNode = {
      type: FunctionType.SIN,
      args: [DEFAULT_NODE],
    };

    component.argumentChange(newArgument, 0);

    const expectedFunction: TreeNode = {
      type: FunctionType.ADDITION,
      args: [newArgument, DEFAULT_NODE],
    };
    expect(component.node).toEqual(expectedFunction);
  });

  it('should change constant value if function type is constant', () => {
    fixture.detectChanges();

    component.group.controls.type.setValue(FunctionType.CONSTANT);
    fixture.detectChanges();

    const constantInput = getInput('#constant');
    typeInput(constantInput, 100);

    const expectedFunction: TreeNode = {
      type: FunctionType.CONSTANT,
      value: 100,
    };

    expect(component.node).toEqual(expectedFunction);
  });

  it('should not emit new value if the constant field is empty', () => {
    fixture.detectChanges();
    const callback = jasmine.createSpy('callback');
    component.nodeChange.subscribe(callback, callback);

    component.group.controls.type.setValue(FunctionType.CONSTANT);
    fixture.detectChanges();

    const constantInput = getInput('#constant');
    constantInput.value = '';
    constantInput.dispatchEvent(new Event('input'));

    expect(callback.calls.count()).toBe(1);
  });

  it('should change range if function type is integral', () => {
    fixture.detectChanges();

    component.group.controls.type.setValue(FunctionType.INTEGRAL);
    fixture.detectChanges();

    const [integralA, integralB] = [getInput('#integralA'), getInput('#integralB')];
    typeInput(integralA, -10);
    typeInput(integralB, 10);

    const expectedFunction: TreeNode = {
      type: FunctionType.INTEGRAL,
      range: [-10, 10],
      args: [DEFAULT_NODE],
    };

    expect(component.node).toEqual(expectedFunction);
  });

  it('should trigger integral range error if a >= b', () => {
    fixture.detectChanges();

    component.group.controls.type.setValue(FunctionType.INTEGRAL);
    fixture.detectChanges();

    const [integralA, integralB] = [getInput('#integralA'), getInput('#integralB')];
    typeInput(integralA, 10);
    typeInput(integralB, -10);

    expect(component.group.controls.range.errors).toEqual({ invalidRange: true });
  });

  it('should emit changes when either the function type or an argument changes', async(() => {
    fixture.detectChanges();

    const callback = jasmine.createSpy('callback');
    component.nodeChange.subscribe(callback);

    component.group.controls.type.setValue(FunctionType.ADDITION);
    fixture.detectChanges();

    const newArg: TreeNode = { type: FunctionType.CONSTANT, value: 100 };
    component.argumentChange(newArg, 0);

    expect(component.node).toEqual({ type: FunctionType.ADDITION, args: [newArg, DEFAULT_NODE] });
    expect(callback.calls.count()).toBe(2);
  }));

  it('should display nested tree-node component as arguments', () => {
    fixture.detectChanges();

    component.group.controls.type.setValue(FunctionType.MULTIPLICATION);
    fixture.detectChanges();

    const newArg: TreeNode = { type: FunctionType.CONSTANT, value: 100 };
    component.argumentChange(newArg, 0);
    fixture.detectChanges();

    const args = getArguments() as TreeNodeComponent[];
    expect(args.length).toBe(2);

    args[0].nodeChange.emit(newArg);
    const expectedFunction: TreeNode = {
      type: FunctionType.MULTIPLICATION,
      args: [newArg, DEFAULT_NODE],
    };
    expect(component.node).toEqual(expectedFunction);
  });
});
