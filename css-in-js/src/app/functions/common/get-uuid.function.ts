import { v4 as uuidv4 } from 'uuid';
import { Uuid } from '../../declarations/types/uuid.type';

export function getUuid(): Uuid {
  return uuidv4();
}
