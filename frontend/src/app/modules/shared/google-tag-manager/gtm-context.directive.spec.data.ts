import { Component } from '@angular/core';

const initialData = {
  gtmContext: 'testContext',
  gtmData: {
    testData1: 'testGtmData1',
    testData2: 'testGtmData2',
  },
};
const expectedAttributeKeys = ['data-gtm-context', 'data-gtm-test-data1', 'data-gtm-test-data2'];
const expectedDatasetKeys = {
  gtmContext: 'gtmContext',
  testData1: 'gtmTestData1',
  testData2: 'gtmTestData2',
};
const noGtmContextNoGtmDataSelector = `span:not([${expectedAttributeKeys[0]}]):not([${expectedAttributeKeys[1]}]):not([${expectedAttributeKeys[2]}])`;

@Component({
  template: `
    <span [withGtmContext]="gtmContext">Test gtm context</span>
    <span [withGtmContext]="gtmContext" [gtmData]="gtmData">Test gtm context with gtm data</span>
    <span withGtmContext [gtmData]="gtmData">Test gtm data - no context</span>
    <span>No context, no data</span>
  `,
})
export class GtmContextDirectiveTestComponent {
  gtmContext = initialData.gtmContext;
  gtmData = initialData.gtmData;
}

export const gtmContextDirectiveSpecData = {
  initialData,
  expectedDatasetKeys,
  noGtmContextNoGtmDataSelector,
};
