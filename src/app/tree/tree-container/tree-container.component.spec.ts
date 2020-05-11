import { Component, Output, EventEmitter, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeContainerComponent } from './tree-container.component';
import { By } from '@angular/platform-browser';
import { TreeNode } from '../tree-node/tree-node.component';
import { FunctionType } from 'src/app/shared/models/Function';

@Component({ selector: 'app-tree-node', template: '<p id="tree-node"></p>' })
class TreeNodeStubComponent {
  @Output() nodeChange = new EventEmitter();
}

describe('TreeContainerComponent', () => {
  let component: TreeContainerComponent;
  let fixture: ComponentFixture<TreeContainerComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeContainerComponent, TreeNodeStubComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const title = de.query(By.css('h3')).nativeElement as HTMLHeadingElement;
    expect(title.textContent).toContain('Construct the function');
  });

  it('should render tree-node component', () => {
    const treeNode = de.query(By.css('p#tree-node'));
    expect(treeNode).toBeDefined();
  });

  it('should emit incoming data from treen node', () => {
    const callback = jasmine.createSpy('callback');

    const treeNode = de.query(By.css('app-tree-node'));
    const treeNodeComponent = treeNode.componentInstance as TreeNodeStubComponent;

    component.functionChange.subscribe(callback);

    const newNode: TreeNode = { type: FunctionType.CONSTANT, value: 1 };
    treeNodeComponent.nodeChange.emit(newNode);

    expect(callback.calls.count()).toBe(1);
    expect(callback.calls.first().args).toEqual([newNode]);
  });
});
