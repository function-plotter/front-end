import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeContainerComponent } from './tree-container.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TreeContainerComponent', () => {
  let component: TreeContainerComponent;
  let fixture: ComponentFixture<TreeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeContainerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
