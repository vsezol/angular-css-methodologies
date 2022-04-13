import { TimeLog } from '../interfaces/time-log.interface';
import { TimeRange } from '../interfaces/time-range.interface';
import { getUuid } from '../../functions/common/get-uuid.function';

type Props = Partial<Pick<TimeLog, 'isVoid' | 'id' | 'description'>> & Omit<TimeLog, 'isVoid' | 'id' | 'description'>;

export class TimeLogDTO implements TimeLog {
  public readonly id: string;
  public readonly isVoid: boolean;
  public readonly description: string;
  public readonly timeRange: TimeRange;

  constructor({ isVoid = false, description = '', timeRange, id = getUuid() }: Props) {
    this.id = id;
    this.description = description;
    this.timeRange = timeRange;
    this.isVoid = isVoid;
  }
}
