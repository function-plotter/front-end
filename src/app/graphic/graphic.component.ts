import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Coordinates } from '../shared/models/graphic.model';
import { SolverService } from '../shared/services/solver.service';
import { Solution, Coordinate } from '../shared/models/Solution';
import { TreeNode } from '../tree/tree-node/tree-node.component';
import { FunctionType } from '../shared/models/Function';

const GUIDELINES_COLOR = '#555';
const GRAPH_COLOR = '#673ab7';
const FILL_COLOR = '#ffeeff';
const GRAPH_FILENAME = 'graph.png';
const INITIAL_SCALE = 1.0;

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss'],
})
export class GraphicComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  width = 500;
  height = 500;
  scale = INITIAL_SCALE;
  virtualScale = INITIAL_SCALE;
  scaleMultiplier = 0.1;
  lastSolution: Solution;
  lastFunc: TreeNode;

  private maxX: number;
  private maxY: number;
  private minX: number;
  private minY: number;

  private maxScale = 5;
  private minScale = 0.3;

  constructor(private solver: SolverService) {}

  ngOnInit(): void {
    // init the canvas
    const canvas = this.canvas.nativeElement;
    canvas.width = this.width;
    canvas.height = this.height;

    // create the guidelines
    const ctx = canvas.getContext('2d');
    this.createGraphic(ctx);

    this.solver.solution.subscribe(({ func, solution }: { func: TreeNode; solution: Solution }) =>
      this.handleSolutionChange(ctx, solution, func),
    );
  }

  downloadPNG(): void {
    const link = document.createElement('a');
    link.download = GRAPH_FILENAME;
    link.href = this.canvas.nativeElement.toDataURL();
    link.click();
  }

  downloadCSV(): void {
    let content = 'X Y';
    this.lastSolution.forEach((s: Coordinate) => {
      content += '\r\n';
      content += `${s.x} ${s.y}`;
    });
    const blob = new Blob([content],{
      type: 'application/*'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('visibility', 'hidden');
    link.download = 'results.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  zoomIn(): void {
    if (this.virtualScale < this.maxScale) {
      this.virtualScale += this.scaleMultiplier;
      this.scale = INITIAL_SCALE + this.scaleMultiplier;
      this.zoomGraph();
    }
  }

  zoomOut(): void {
    if (this.virtualScale > this.minScale) {
      this.virtualScale -= this.scaleMultiplier;
      this.scale = INITIAL_SCALE - this.scaleMultiplier;
      this.zoomGraph();
    }
  }

  private zoomGraph(): void {
    const newWidth = this.width * this.scale;
    const newHeight = this.height * this.scale;
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate((this.width - newWidth) / 2, (this.height - newHeight) / 2);
    ctx.scale(this.scale, this.scale);
    this.createGraphic(ctx);
    this.renderFunction(ctx, this.lastSolution);
  }

  private handleSolutionChange(ctx: CanvasRenderingContext2D, solution: Coordinate[], func: TreeNode): void {
    if (!solution.length) {
      return;
    }
    this.lastSolution = solution;
    this.lastFunc = func;
    ctx.clearRect(0, 0, this.width / this.virtualScale, this.height / this.virtualScale);

    // compute min and max x and y
    this.maxX = this.minX = solution[0].x;
    for (const coordinate of solution) {
      if (coordinate.x > this.maxX) {
        this.maxX = coordinate.x;
      }
      if (coordinate.x < this.minX) {
        this.minX = coordinate.x;
      }
    }
    // extend by 1 point the guidelines
    this.maxX++;
    this.maxY = (this.maxX * this.height) / this.width;
    this.minX--;
    this.minY = (this.minX * this.height) / this.width;

    this.createGraphic(ctx);
    this.renderFunction(ctx, solution);
  }

  private createGraphic(ctx: CanvasRenderingContext2D): void {
    // +Y axis
    ctx.save();
    ctx.lineWidth = 1.3 / this.virtualScale;
    this.drawAx(ctx, 0, this.maxY);

    // -Y axis
    this.drawAx(ctx, 0, this.minY);

    // +X axis
    this.drawAx(ctx, this.maxX, 0);

    // -X axis
    this.drawAx(ctx, this.minX, 0);

    for (let i = 1; i < this.maxY; i++) {
      this.drawYTickMarks(ctx, 0, i);
    }

    for (let i = 1; i > this.minY; i--) {
      this.drawYTickMarks(ctx, 0, i);
    }

    for (let i = 1; i < this.maxX; i++) {
      this.drawXTickMarks(ctx, i, 0);
    }

    for (let i = 1; i > this.minX; i--) {
      this.drawXTickMarks(ctx, i, 0);
    }
    ctx.restore();
  }

  private drawAx(ctx: CanvasRenderingContext2D, XC: number, YC: number): void {
    ctx.beginPath();
    ctx.moveTo(this.XC(0), this.YC(0));
    ctx.lineTo(this.XC(XC), this.YC(YC));
    ctx.stroke();
  }

  private drawYTickMarks(ctx: CanvasRenderingContext2D, XC: number, YC: number): void {
    ctx.beginPath();
    ctx.moveTo(this.XC(XC) - 5 / this.virtualScale, this.YC(YC));
    ctx.lineTo(this.XC(XC) + 5 / this.virtualScale, this.YC(YC));
    ctx.stroke();
  }

  private renderFunction(ctx: CanvasRenderingContext2D, coordinates: Coordinate[] = []): void {
    if (!coordinates.length) {
      return;
    }

    if (this.lastFunc.type === FunctionType.INTEGRAL) {
      ctx.save();
      const aCoordinate = coordinates.findIndex(({ x }) => x === this.lastFunc.range[0]);
      const bCoordinate = coordinates.findIndex(({ x }) => x === this.lastFunc.range[1]);
      ctx.beginPath();
      ctx.moveTo(this.XC(coordinates[aCoordinate].x), this.YC(0));
      for (let i = aCoordinate; i <= bCoordinate; i++) {
        ctx.lineTo(this.XC(coordinates[i].x), this.YC(coordinates[i].y));
      }
      ctx.lineTo(this.XC(coordinates[bCoordinate].x), this.YC(0));
      ctx.closePath();
      ctx.fillStyle = FILL_COLOR;
      ctx.lineWidth = 0;
      ctx.strokeStyle = 'white';
      ctx.fill();
      ctx.restore();
    }

    let firstPoint = true;
    ctx.lineWidth = 1.5 / this.virtualScale;

    ctx.strokeStyle = GRAPH_COLOR;
    coordinates.forEach((c: Coordinates) => {
      if (firstPoint) {
        ctx.moveTo(this.XC(c.x), this.YC(c.y));
        firstPoint = false;
      } else {
        ctx.lineTo(this.XC(c.x), this.YC(c.y));
      }
    });
    ctx.stroke();
    ctx.strokeStyle = GUIDELINES_COLOR;
  }

  private drawXTickMarks(ctx: CanvasRenderingContext2D, XC: number, YC: number): void {
    ctx.beginPath();
    ctx.moveTo(this.XC(XC), this.YC(YC) - 5 / this.virtualScale);
    ctx.lineTo(this.XC(XC), this.YC(YC) + 5 / this.virtualScale);
    ctx.stroke();
  }

  private XC(x: number): number {
    return ((x - this.minX) / (this.maxX - this.minX)) * this.width;
  }

  private YC(y: number): number {
    return this.height - ((y - this.minY) / (this.maxY - this.minY)) * this.height;
  }
}
