import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtmContextDirective } from './gtm-context.directive';
import { gtmContextDirectiveSpecData, GtmContextDirectiveTestComponent } from './gtm-context.directive.spec.data';

describe('GtmContextDirective', () => {
  const { initialData, expectedDatasetKeys, noGtmContextNoGtmDataSelector } = gtmContextDirectiveSpecData;

  const getDatasetValueByKey = (element: HTMLElement, datasetKey: string): string => element.dataset[datasetKey];

  const createFixture = () =>
    TestBed.configureTestingModule({
      declarations: [GtmContextDirective, GtmContextDirectiveTestComponent],
    }).createComponent(GtmContextDirectiveTestComponent);

  let elementsWithGtmContext: DebugElement[];
  let fixture: ComponentFixture<GtmContextDirectiveTestComponent>;

  beforeEach(() => {
    fixture = createFixture();
    fixture.detectChanges();
    elementsWithGtmContext = fixture.debugElement.queryAll(By.directive(GtmContextDirective));
  });

  it('should have three elements with gtm context', () => {
    expect(elementsWithGtmContext.length).toEqual(3);
  });

  it('should have element with no gtm context and no gtm data', () => {
    const span = fixture.debugElement.query(By.css(noGtmContextNoGtmDataSelector));
    expect(span).toBeTruthy();
  });

  it('should have element with gtm context but no gtm data attribute', () => {
    const testedElement = elementsWithGtmContext[0].nativeElement;

    expect(getDatasetValueByKey(testedElement, expectedDatasetKeys.gtmContext)).toEqual(initialData.gtmContext);
    expect(getDatasetValueByKey(testedElement, expectedDatasetKeys.testData1)).toBeUndefined();
    expect(getDatasetValueByKey(testedElement, expectedDatasetKeys.testData2)).toBeUndefined();
  });

  it('should have element with gtm context and both gtm data attributes', () => {
    const testedElement = elementsWithGtmContext[1].nativeElement;

    expect(getDatasetValueByKey(testedElement, expectedDatasetKeys.gtmContext)).toEqual(initialData.gtmContext);
    expect(getDatasetValueByKey(testedElement, expectedDatasetKeys.testData1)).toEqual(initialData.gtmData.testData1);
    expect(getDatasetValueByKey(testedElement, expectedDatasetKeys.testData2)).toEqual(initialData.gtmData.testData2);
  });

  it('should have element with no gtm context but both gtm data attributes', () => {
    const testedElement = elementsWithGtmContext[2].nativeElement;

    expect(getDatasetValueByKey(testedElement, expectedDatasetKeys.gtmContext)).toBeUndefined();
    expect(getDatasetValueByKey(testedElement, expectedDatasetKeys.testData1)).toEqual(initialData.gtmData.testData1);
    expect(getDatasetValueByKey(testedElement, expectedDatasetKeys.testData2)).toEqual(initialData.gtmData.testData2);
  });
});
