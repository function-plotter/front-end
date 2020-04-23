import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FunctionType, Functions } from 'src/app/shared/models/Function';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface TreeNode {
  type: FunctionType;
  value?: number;
  args?: TreeNode[];
}

export const DEFAULT_NODE: TreeNode = {
  type: FunctionType.VARIABLE,
};

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
})
export class TreeNodeComponent implements OnInit, OnDestroy {
  @Input() accepts: FunctionType[] = [];
  @Input() exclude: FunctionType[] = [];

  // emit new subtree changes
  @Output() nodeChange: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();

  // array of available function types computed based on the `accepts` and `exclude` inputs
  availableTypes: FunctionType[] = [];

  // store a representation of the subtree which has its root in this node
  nodeRepresentation: TreeNode = DEFAULT_NODE;

  // for template usage
  Functions = Functions;
  FunctionType = FunctionType;
  Array = Array;

  group: FormGroup;
  typeSubscription: Subscription;
  constSubscription: Subscription;

  constructor() {}

  private getAvailableTypes(accepts: FunctionType[], exclude: FunctionType[]) {
    const available = accepts.length ? accepts : (Object.values(FunctionType) as FunctionType[]);
    const filtered = {};
    for (const excludedFunction of exclude) {
      filtered[excludedFunction] = true;
    }
    return available.filter((type) => !filtered[type]);
  }

  typeChange(type: FunctionType) {
    // reconstruct node object with the selected type
    const node: TreeNode = { type };

    // if this function type supports arguments, compute a list
    // of default tree nodes representing the arguments
    if (Functions[type].args) {
      node.args = Array(Functions[type].args).fill(DEFAULT_NODE);
    }

    // if the function type is constant, set the value to the node representation
    if (type === FunctionType.CONSTANT) {
      node.value = this.group.value.constant;
    }

    this.nodeRepresentation = node;
    this.nodeChange.emit(node);
  }

  argumentChange(node: TreeNode, index: number) {
    this.nodeRepresentation.args[index] = node;
    this.nodeChange.emit(this.nodeRepresentation);
  }

  constantChange(value: number) {
    this.nodeRepresentation.value = value;
    this.nodeChange.emit(this.nodeRepresentation);
  }

  ngOnInit(): void {
    this.group = new FormGroup({
      type: new FormControl(DEFAULT_NODE.type),
      constant: new FormControl(1),
    });

    this.typeSubscription = this.group.controls.type.valueChanges.subscribe((type) => this.typeChange(type));
    this.constSubscription = this.group.controls.constant.valueChanges.subscribe((value) => this.constantChange(value));
    this.availableTypes = this.getAvailableTypes(this.accepts, this.exclude);
  }

  ngOnDestroy(): void {
    this.typeSubscription.unsubscribe();
    this.constSubscription.unsubscribe();
  }
}
