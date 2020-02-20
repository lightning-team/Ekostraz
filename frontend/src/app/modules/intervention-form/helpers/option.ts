interface SelectOption<T> {
  value: T;
  displayValue: string;
}

type PrimitiveOption = string | number | boolean;

export class Option {
  static of<OptionValue extends PrimitiveOption>(value: OptionValue, displayValue?: string): SelectOption<OptionValue> {
    return {
      value,
      displayValue: displayValue || (value as string),
    };
  }
}
