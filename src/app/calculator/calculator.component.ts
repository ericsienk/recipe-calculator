import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const signMap: any = {
  '/': '÷',
  '*': 'x',
};

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  calculation: string = '';
  ingredients: Ingredient[] = [];
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    //?i=flour:220:g:~salt:17:g
    const i = this.route.snapshot.queryParamMap.get('i');
    //?c=\:4.5
    const c = this.route.snapshot.queryParamMap.get('c');
    if (i && c) {
      const [sign, scale] = c.split(':');
      this.calculation = signMap[sign] + scale;
      this.ingredients = i.split('~').map((item) => {
        const [name, quantity, unit] = item.split(':');
        return {
          name,
          quantity: Number(quantity),
          scaledQuantity: calculate(Number(quantity), sign, Number(scale)),
          unit: unit as MetricUnit,
        };
      });
    }
  }
}

function calculate(quantity: number, sign: string, scale: number): number {
  if (sign === '*') {
    return quantity * scale;
  }

  return Number((quantity / scale).toFixed(3));
}

type MetricUnit = 'g' | 'mg' | 'L' | 'mL';

type Ingredient = {
  name: string;
  quantity: number;
  scaledQuantity: number;
  unit: MetricUnit;
};
