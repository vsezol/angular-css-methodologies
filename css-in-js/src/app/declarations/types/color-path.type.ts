import { ColorTints } from './color-tints.type';
import { ColorNames } from './color-names.type';

export type ColorPath = [ColorNames, ColorTints] | [ColorNames] | ColorNames;
