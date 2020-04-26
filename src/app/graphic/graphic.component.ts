import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Coordinates } from '../shared/models/graphic.model';
import { SolverService } from '../shared/services/solver.service';
import { Solution, Coordinate } from '../shared/models/Solution';

const GUIDELINES_COLOR = '#555';
const GRAPH_COLOR = '#673ab7';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss'],
})
export class GraphicComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  width = 500;
  height = 500;

  private maxX: number;
  private maxY: number;
  private minX: number;
  private minY: number;

  get MaxX(): number {
    return 10;
  }

  get MinX(): number {
    return -10;
  }

  get MaxY(): number {
    return (this.MaxX * this.height) / this.width;
  }

  get MinY(): number {
    return (this.MinX * this.height) / this.width;
  }

  constructor(private solver: SolverService) {}

  ngOnInit(): void {
    // init the canvas
    const canvas = this.canvas.nativeElement;
    canvas.width = this.width;
    canvas.height = this.height;

    // create the guidelines
    const ctx = canvas.getContext('2d');
    this.createGraphic(ctx);

    this.solver.solution.subscribe((solution: Solution) => this.handleSolutionChange(ctx, solution));
  }

  private handleSolutionChange(ctx: CanvasRenderingContext2D, solution: Coordinate[]) {
    if (!solution.length) {
      return;
    }
    ctx.clearRect(0, 0, this.width, this.height);

    // compute min and max x and y
    this.maxX = this.minX = solution[0].x;
    this.maxY = this.minY = solution[0].y;
    for (const coordinate of solution) {
      if (coordinate.x > this.maxX) {
        this.maxX = coordinate.x;
      }
      if (coordinate.x < this.minX) {
        this.minX = coordinate.x;
      }
      if (coordinate.y > this.maxY) {
        this.maxY = coordinate.y;
      }
      if (coordinate.y < this.minY) {
        this.minY = coordinate.y;
      }
    }
    // extend by 1 point the guidelines
    this.maxX++;
    this.maxY++;
    this.minY--;
    this.minX--;

    this.createGraphic(ctx);
    this.renderFunction(ctx, solution);
  }

  private createGraphic(ctx: CanvasRenderingContext2D): void {
    // +Y axis
    ctx.save();
    ctx.lineWidth = 2;
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
    ctx.moveTo(this.XC(XC) - 5, this.YC(YC));
    ctx.lineTo(this.XC(XC) + 5, this.YC(YC));
    ctx.stroke();
  }

  private renderFunction(ctx: CanvasRenderingContext2D, coordinates: Coordinate[]): void {
    let firstPoint = true;
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
    console.log('rendered function');
  }

  private drawXTickMarks(ctx: CanvasRenderingContext2D, XC: number, YC: number): void {
    ctx.beginPath();
    ctx.moveTo(this.XC(XC), this.YC(YC) - 5);
    ctx.lineTo(this.XC(XC), this.YC(YC) + 5);
    ctx.stroke();
  }

  private XC(x: number): number {
    return ((x - this.MinX) / (this.MaxX - this.MinX)) * this.width;
  }

  private YC(y: number): number {
    return this.height - ((y - this.MinY) / (this.MaxY - this.MinY)) * this.height;
  }
}
