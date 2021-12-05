import { Nullable } from '../../declarations/types/nullable.type';
import { isNil } from './is-nil.function';

export const isNotNil = <T>(value: Nullable<T>): value is NonNullable<T> => !isNil(value);
