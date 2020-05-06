import { TestBed } from '@angular/core/testing';

import { SolverService } from './solver.service';
import { HttpClient } from '@angular/common/http';

describe('SolverService', () => {
  let service: SolverService;
  let httpSpy: { get: jasmine.Spy };

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({ providers: [{ provide: HttpClient, useValue: httpSpy }] });
    service = TestBed.inject(SolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
