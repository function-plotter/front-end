import { Component, OnInit } from '@angular/core';
import { TreeNode } from '../tree-node/tree-node.component';

@Component({
  selector: 'app-tree-container',
  templateUrl: './tree-container.component.html',
  styleUrls: ['./tree-container.component.scss']
})
export class TreeContainerComponent implements OnInit {

  constructor() { }

  treeChange(node: TreeNode) {
    console.log(node);
  }

  ngOnInit(): void {
  }

}
