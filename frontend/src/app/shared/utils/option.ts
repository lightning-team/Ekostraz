interface SelectOption<T> {
  value: T;
  displayValue: string;
}

type PrimitiveOption = string | number | boolean;

export class Option {
  static of<OptionValue extends PrimitiveOption>(value: OptionValue, displayValue?: string): SelectOption<OptionValue> {
    return {
      value,
      displayValue: displayValue || String(value),
    };
  }
}

export class Options {
  static fromMap<OptionValue extends PrimitiveOption>(
    convertedMap: Map<OptionValue, string>,
  ): SelectOption<OptionValue>[] {
    return [...convertedMap.entries()].map(this.toOption);
  }

  private static toOption<OptionValue extends PrimitiveOption>([key, value]: [OptionValue, string]) {
    return Option.of(key, value);
  }
}
