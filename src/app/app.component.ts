import { Component, OnInit } from '@angular/core';
import { VariableRange, DEFAULT_RANGE } from './input/input.component';
import { TreeNode, DEFAULT_NODE } from './tree/tree-node/tree-node.component';
import { SolverService } from './shared/services/solver.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private func: TreeNode = DEFAULT_NODE;
  private range: VariableRange = DEFAULT_RANGE;
  constructor(private solver: SolverService) {}
  onRangeChange(range: VariableRange) {
    this.range = range;
    this.solver.solve(this.func, this.range);
  }

  onFunctionChange(func: TreeNode) {
    this.func = func;
    this.solver.solve(this.func, this.range);
  }

  ngOnInit(): void {
    this.solver.solve(this.func, this.range);
  }
}
