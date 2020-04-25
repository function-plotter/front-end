import { Component, OnInit } from '@angular/core';
import { Coordinates } from '../shared/models/graphic.model';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit {

  coordinates = [{x:-6, y:6}, {x:2, y:8}, {x:3, y:8}, {x:2.3, y:9.32}];
  width = 500;
  height = 500;

  get MaxX(): number {
    return 10;
  }

  get MinX(): number {
    return -10;
  }

  get MaxY(): number {
    return this.MaxX * this.height/this.width;
  }

  get MinY(): number {
    return this.MinX * this.height/this.width;
  }

  constructor() { }

  ngOnInit(): void {
    const canvas = document.getElementById('graphic') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    this.createGraphic(ctx);
    this.renderFunction(ctx);
  }

  private createGraphic(ctx: CanvasRenderingContext2D): void {
    // +Y axis
    ctx.save();
    ctx.lineWidth = 2;
    this.drawAx(ctx, 0, this.MaxY);

    // -Y axis
    this.drawAx(ctx, 0, this.MinY);

    // +X axis
    this.drawAx(ctx, this.MaxX, 0);

    // -X axis
    this.drawAx(ctx, this.MinX, 0);
    
    for(let i=1; i < this.MaxY; i++) {
      this.drawYTickMarks(ctx, 0, i);
    }

    for(let i=1; i > this.MinY; i--) {
      this.drawYTickMarks(ctx, 0, i);
    }

    for(let i=1; i < this.MaxX; i++) {
      this.drawXTickMarks(ctx, i, 0);
    }

    for(let i=1; i > this.MinX; i--) {
      this.drawXTickMarks(ctx, i, 0);
    }
    ctx.restore();
  }

  private drawAx(ctx:CanvasRenderingContext2D, XC: number, YC: number): void {
    ctx.beginPath();
    ctx.moveTo(this.XC(0), this.YC(0));
    ctx.lineTo(this.XC(XC), this.YC(YC));
    ctx.stroke();
  }

  private drawYTickMarks(ctx:CanvasRenderingContext2D, XC: number, YC: number): void {
    ctx.beginPath();
    ctx.moveTo(this.XC(XC) - 5, this.YC(YC));
    ctx.lineTo(this.XC(XC) + 5, this.YC(YC));
    ctx.stroke();
  }

  private renderFunction(ctx:CanvasRenderingContext2D): void {
    let firstPoint = true;
    this.coordinates.forEach((c: Coordinates) => {
      if(firstPoint) {
        ctx.moveTo(this.XC(c.x), this.YC(c.y));
        firstPoint = false;
      } else {
        ctx.lineTo(this.XC(c.x), this.YC(c.y));
      }
    });
    ctx.stroke();
  }

  private drawXTickMarks(ctx:CanvasRenderingContext2D, XC: number, YC: number): void {
    ctx.beginPath();
    ctx.moveTo(this.XC(XC), this.YC(YC) - 5);
    ctx.lineTo(this.XC(XC), this.YC(YC) + 5);
    ctx.stroke();
  }

  private XC(x: number): number {
    return (x - this.MinX) / (this.MaxX - this.MinX) * this.width;
  }

  private YC(y: number): number {
    return this.height - (y - this.MinY) / (this.MaxY - this.MinY) * this.height;
  }

}
