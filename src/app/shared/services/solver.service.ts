import { Injectable, EventEmitter } from '@angular/core';
import { Solution } from '../models/Solution';
import { TreeNode } from 'src/app/tree/tree-node/tree-node.component';
import { VariableRange, DEFAULT_RANGE } from 'src/app/input/input.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const DEFAULT_SOLUTION: Solution = [
  { x: -5, y: -5 },
  { x: -4, y: -4 },
  { x: -3, y: -3 },
  { x: -2, y: -2 },
  { x: -1, y: -1 },
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 2 },
  { x: 3, y: 3 },
  { x: 4, y: 4 },
  { x: 5, y: 5 },
];

@Injectable({
  providedIn: 'root',
})
export class SolverService {
  solution: EventEmitter<Solution> = new EventEmitter();

  constructor(private http: HttpClient) {}

  solve(func: TreeNode, range: VariableRange) {
    this.http
      .post(environment.apiUrl, {
        range,
        function: func,
      })
      .subscribe(
        (response: Solution) => {
          console.log(`solution`, response);
          if (response.length) {
            this.solution.emit(response);
          } else {
            this.solution.emit(DEFAULT_SOLUTION);
          }
        },
        (err) => {
          console.error(err);
          this.solution.emit(DEFAULT_SOLUTION);
        },
      );
  }
}
