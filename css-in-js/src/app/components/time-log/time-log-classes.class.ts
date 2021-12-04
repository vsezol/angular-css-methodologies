import { css } from '@emotion/css';
import { ThemeService } from '../../services/theme.service';
import { OVERFLOW_ELLIPSIS_STYLE } from '../../constants/style/overflow-ellipsis.style';

export class TimeLogClasses {
  private readonly minHeight: string = '40px';
  private readonly fontSize: string = '0.8rem';

  constructor(private readonly themeService: ThemeService) {}

  public readonly root: string = css`
    cursor: pointer;
    min-height: ${this.minHeight};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;

    color: ${this.themeService.getColor('light')};
    background-color: ${this.themeService.getColor(['dark', 300])};

    transition: 0.2s;

    :hover {
      background-color: ${this.themeService.getColor(['dark', 400])};
    }
  `;

  public readonly timeWrapper: string = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  public readonly timeRange: string[] = [
    this.timeWrapper,
    css`
      margin-right: 10px;
    `
  ];

  public readonly time: string = css`
    font-size: ${this.fontSize};
    padding: 0px 2px;
  `;

  public readonly timeDiff: string[] = [
    this.time,
    css`
      width: 80px;
      display: flex;
      justify-content: start;
      align-items: center;
    `
  ];

  public readonly descriptionWrapper: string = css`
    margin-right: 20px;
    width: 100%;
    height: inherit;
    ${OVERFLOW_ELLIPSIS_STYLE};
  `;

  public readonly descriptionInput: string = css`
    display: block;
    min-width: 100%;
  `;

  public readonly description: string = css`
    font-size: ${this.fontSize};
    white-space: nowrap;
    ${OVERFLOW_ELLIPSIS_STYLE};
    width: 100%;
    content: '';
    min-height: ${this.minHeight};
    display: flex;
    align-items: center;
  `;
}
