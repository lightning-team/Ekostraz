interface SelectOption<T> {
  value: string;
  displayValue: T | string;
}

export class Option {
  static of<T = string>(value: string, displayValue?: any): SelectOption<T> {
    return {
      value,
      displayValue: displayValue || value,
    };
  }
}
