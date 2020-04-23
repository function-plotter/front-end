import { Component, OnInit, Input } from '@angular/core';
import { FunctionType, Functions } from 'src/app/shared/models/Function';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
})
export class TreeNodeComponent implements OnInit {
  type: FunctionType = FunctionType.VARIABLE;
  constant = 1;
  @Input() accepts: FunctionType[] = [];
  @Input() exclude: FunctionType[] = [];
  availableTypes: FunctionType[] = [];

  // for template usage
  Functions = Functions;
  FunctionType = FunctionType;
  Array = Array;

  constructor() {}

  private getAvailableTypes(accepts: FunctionType[], exclude: FunctionType[]) {
    const available = accepts.length ? accepts : (Object.values(FunctionType) as FunctionType[]);
    const filtered = {};
    for (const excludedFunction of exclude) {
      filtered[excludedFunction] = true;
    }
    return available.filter((type) => !filtered[type]);
  }

  ngOnInit(): void {
    this.availableTypes = this.getAvailableTypes(this.accepts, this.exclude);
  }
}
