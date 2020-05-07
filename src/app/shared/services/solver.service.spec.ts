import { TestBed, async } from '@angular/core/testing';

import { SolverService, DEFAULT_SOLUTION } from './solver.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DEFAULT_RANGE } from 'src/app/input/input.component';
import { DEFAULT_NODE } from 'src/app/tree/tree-node/tree-node.component';
import { Observable, defer } from 'rxjs';
import { fn } from '@angular/compiler/src/output/output_ast';

describe('SolverService', () => {
  let service: SolverService;
  let httpSpy: { post: jasmine.Spy };

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    TestBed.configureTestingModule({ providers: [{ provide: HttpClient, useValue: httpSpy }] });
    service = TestBed.inject(SolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call post method', () => {
    httpSpy.post.and.returnValue(defer(() => Promise.resolve([])));

    service.solve(DEFAULT_NODE, DEFAULT_RANGE);
    expect(httpSpy.post.calls.count()).toBe(1, 'number of calls');
  });

  it('should emit function and solution after solving', async(() => {
    httpSpy.post.and.returnValue(defer(() => Promise.resolve(DEFAULT_SOLUTION)));

    service.solution.subscribe(({ func, solution }) => {
      expect(func).toEqual(DEFAULT_NODE, 'selected function');
      expect(solution).toEqual(DEFAULT_SOLUTION, 'emitted solution');
    });

    service.solve(DEFAULT_NODE, DEFAULT_RANGE);
  }));

  it('should emit default values on network error', async(() => {
    const httpError = new HttpErrorResponse({ error: 'test network error', status: 500 });
    httpSpy.post.and.returnValue(defer(() => Promise.reject(httpError)));

    service.solution.subscribe(({ func, solution }) => {
      expect(func).toEqual(DEFAULT_NODE);
      expect(solution).toEqual(DEFAULT_SOLUTION);
    });

    service.solve(DEFAULT_NODE, DEFAULT_RANGE);
  }));
});
