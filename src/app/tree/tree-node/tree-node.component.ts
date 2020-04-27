import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FunctionType, Functions } from 'src/app/shared/models/Function';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface TreeNode {
  type: FunctionType;
  range?: [number, number];
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeComponent implements OnInit, OnDestroy {
  @Input() accepts: FunctionType[] = [];
  @Input() exclude: FunctionType[] = [];
  @Input() node: TreeNode = DEFAULT_NODE;

  // emit new subtree changes
  @Output() nodeChange: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();

  // array of available function types computed based on the `accepts` and `exclude` inputs
  availableTypes: FunctionType[] = [];

  // store a representation of the subtree which has its root in this node

  // for template usage
  Functions = Functions;
  FunctionType = FunctionType;
  Array = Array;

  group: FormGroup;
  subscription: Subscription = new Subscription();

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
      node.args = [];
      // Note that Array.prototype.fill does not work in this case
      // as every argument needs to have a different object reference
      // otherwise the first change (from within the child tree-node component)
      // will actually modify all arguments
      for (let i = 0; i < Functions[type].args; i++) {
        node.args.push(Object.assign({}, DEFAULT_NODE));
      }
    }

    // if the function type is constant, set the value to the node representation
    if (type === FunctionType.CONSTANT) {
      node.value = this.group.value.constant;
    }
    // if the function type is integral, set the range
    if (type === FunctionType.INTEGRAL) {
      node.range = [this.group.value.range.a, this.group.value.range.b];
    }

    this.node = node;
    this.nodeChange.emit(node);
  }

  argumentChange(node: TreeNode, index: number) {
    // we need to construct a new object (with new reference)
    // because the change strategy is `OnPush` which will only detect reference changes
    const args = this.node.args;
    args[index] = node;
    this.node = Object.assign({}, this.node, { args });
    this.nodeChange.emit(this.node);
  }

  constantChange(value: number) {
    if (!value || value === this.node.value) {
      return;
    }
    // see `argumentChange` on why Object.assign
    this.node = Object.assign({}, this.node, { value });
    this.nodeChange.emit(this.node);
  }

  integralRangeChange(value: { a: number; b: number }) {
    if (this.group.controls.range.errors) {
      return;
    }
    this.node = Object.assign({}, this.node, { range: [value.a, value.b] });
    this.nodeChange.emit(this.node);
  }

  ngOnInit(): void {
    // init the basic form group
    this.group = new FormGroup({
      type: new FormControl(this.node.type),
      constant: new FormControl(this.node.value || 1, Validators.required),
      range: new FormGroup(
        {
          a: new FormControl(this.node.range ? this.node.range[0] : 1),
          b: new FormControl(this.node.range ? this.node.range[1] : 2),
        },
        (group: FormGroup) => {
          const a = group.controls.a.value;
          const b = group.controls.b.value;
          return a === null || b === null || a >= b ? { invalidRange: true } : null;
        },
      ),
    });

    // handle type changes when user select different function types
    this.subscription.add(this.group.controls.type.valueChanges.subscribe((type) => this.typeChange(type)));
    // handle constant value changes
    // this will only trigger when FunctionType.COSNTANT is selected
    this.subscription.add(this.group.controls.constant.valueChanges.subscribe((value) => this.constantChange(value)));
    // handle integral range change
    this.subscription.add(this.group.controls.range.valueChanges.subscribe((value) => this.integralRangeChange(value)));
    // init the list of available function types that the user can choose from
    this.availableTypes = this.getAvailableTypes(this.accepts, this.exclude);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
