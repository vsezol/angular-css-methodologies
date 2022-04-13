import { SimpleChanges } from '@angular/core';

export function updateByChanges<T>(object: NonNullable<T>, changes: SimpleChanges): T {
  let updatedObject: NonNullable<T> = { ...object };
  for (let key in object) {
    const updatedValue: T[keyof T] = changes?.[key]?.currentValue ?? object[key];
    updatedObject = {
      ...updatedObject,
      [key]: updatedValue
    };
  }

  return updatedObject;
}
