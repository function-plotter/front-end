import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TreeNode } from '../tree-node/tree-node.component';

@Component({
  selector: 'app-tree-container',
  templateUrl: './tree-container.component.html',
  styleUrls: ['./tree-container.component.scss'],
})
export class TreeContainerComponent implements OnInit {
  @Output() functionChange = new EventEmitter<TreeNode>();
  constructor() {}

  treeChange(node: TreeNode) {
    this.functionChange.emit(node);
  }

  ngOnInit(): void {}
}
