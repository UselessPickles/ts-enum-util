import type { ReactNode } from 'react';

export type ValueType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'dateTime'
  | 'time'
  | 'dateTimeRange'
  | 'dateRange'
  | 'money'
  | 'digit'
  | 'select'
  | 'radio'
  | 'radioButton'
  | 'checkbox'
  | 'inputRange'
  | 'null'
  | 'prdSubscriber'
  | 'gPrdSubscriber'
  | 'allPrdSubscriber';

export type ValueEnumKey = string | number;
export type ValueEnumValue = string | number | ReactNode;

export type ValueEnum = Map<ValueEnumKey, ValueEnumValue> | Record<ValueEnumKey, ValueEnumValue>;

export function getValueEnumValue(valueEnum: ValueEnum, key: ValueEnumKey): ValueEnumValue {
  if (valueEnum instanceof Map) {
    return valueEnum?.get(key);
  } else if (typeof valueEnum === 'object') {
    return valueEnum?.[key];
  }
}
