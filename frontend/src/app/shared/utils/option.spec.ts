import { Option, Options } from './option';

const { optionTestData, optionsTestData } = createTestData();

describe('Option', () => {
  optionTestData.forEach(({ value, expected }) => {
    it('should create option from primitive values', () => {
      expect(Option.of(value)).toEqual(expected);
    });
  });
});

describe('Options', () => {
  optionsTestData.forEach(({ testedMap, expectedOptions }) => {
    it('should create options from values Map', () => {
      expect(Options.fromMap<string | number | boolean>(testedMap)).toEqual(expectedOptions);
    });
  });
});

function createTestData() {
  const testedOptionValues = {
    string: 'some value',
    number: 1,
    bool: true,
  };

  const expectedOptionValues = {
    string: { value: testedOptionValues.string, displayValue: testedOptionValues.string },
    number: {
      value: testedOptionValues.number,
      displayValue: '' + testedOptionValues.number,
    },
    bool: {
      value: testedOptionValues.bool,
      displayValue: testedOptionValues.bool.toString(),
    },
  };

  const testedOptionsMap = {
    string: new Map([
      ['test1', 'otherTest1'],
      ['test2', 'otherTest2'],
      ['test3', 'otherTest3'],
    ]),
    number: new Map([
      [1, 'test1'],
      [2, 'test2'],
      [3, 'test3'],
    ]),
    bool: new Map([
      [true, 'Yes'],
      [false, 'No'],
    ]),
  };

  const expectedOptionsMaps = {
    string: [
      { value: 'test1', displayValue: 'otherTest1' },
      { value: 'test2', displayValue: 'otherTest2' },
      { value: 'test3', displayValue: 'otherTest3' },
    ],
    number: [
      { value: 1, displayValue: 'test1' },
      { value: 2, displayValue: 'test2' },
      { value: 3, displayValue: 'test3' },
    ],
    bool: [
      { value: true, displayValue: 'Yes' },
      { value: false, displayValue: 'No' },
    ],
  };

  // tslint:disable-next-line
  const optionTestData = [
    { value: testedOptionValues.string, expected: expectedOptionValues.string },
    { value: testedOptionValues.number, expected: expectedOptionValues.number },
    { value: testedOptionValues.bool, expected: expectedOptionValues.bool },
  ];

  // tslint:disable-next-line
  const optionsTestData = [
    { testedMap: testedOptionsMap.string, expectedOptions: expectedOptionsMaps.string },
    { testedMap: testedOptionsMap.number, expectedOptions: expectedOptionsMaps.number },
    { testedMap: testedOptionsMap.bool, expectedOptions: expectedOptionsMaps.bool },
  ];

  return {
    optionTestData,
    optionsTestData,
  };
}
