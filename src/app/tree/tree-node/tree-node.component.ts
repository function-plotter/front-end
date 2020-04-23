import { Component, OnInit } from '@angular/core';
import { FunctionType, Functions } from 'src/app/shared/models/Function';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
})
export class TreeNodeComponent implements OnInit {
  type: FunctionType;
  accepts: FunctionType[] = [];
  exclude: FunctionType[] = [];
  availableTypes: FunctionType[] = [];

  // for template usage
  Functions = Functions;

  constructor() {}

  ngOnInit(): void {
    const available = this.accepts.length ? this.accepts : (Object.values(FunctionType) as FunctionType[]);
    const filtered = {};
    for (const excludedFunction of this.exclude) {
      filtered[excludedFunction] = true;
    }
    this.availableTypes = available.filter((type) => !filtered[type]);
    console.log(this.availableTypes);
  }
}
