import { Directive, ElementRef, Input, OnInit } from '@angular/core';

interface GtmData {
  [key: string]: string;
}

@Directive({
  selector: '[withGtmContext]',
})
export class GtmContextDirective implements OnInit {
  @Input('withGtmContext') context: string;
  @Input() gtmData: GtmData;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const element = this.el.nativeElement;
    addGtmContextToDataset(this.context, element);
    addGtmDataToDataset(this.gtmData, element);
  }
}

const addGtmContextToDataset = (context: string, element: HTMLElement) => {
  if (!context) return;
  element.dataset.gtmContext = context;
};

const addGtmDataToDataset = (gtmData: GtmData, element: HTMLElement) => {
  if (!gtmData) return;
  for (const [attributeName, attributeValue] of Object.entries(gtmData)) {
    element.dataset[addGtmPrefix(attributeName)] = attributeValue;
  }
};

const addGtmPrefix = (unprefixedName: string): string =>
  'gtm' + unprefixedName[0].toUpperCase() + unprefixedName.slice(1);
