import { Component } from '@angular/core';
import { VariableRange } from './input/input.component';
import { TreeNode } from './tree/tree-node/tree-node.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  onRangeChange(range: VariableRange) {
    console.log(range);
  }

  onFunctionChange(func: TreeNode) {
    console.log(func);
  }
}
