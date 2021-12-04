import { ThemeService } from '../../../../services/theme.service';
import { css } from '@emotion/css';
import { OVERFLOW_ELLIPSIS_STYLE } from '../../../../constants/style/overflow-ellipsis.style';

interface GetHostClassesProps {
  width: number;
  isVoid: boolean;
}

export class TimeBarPartClasses {
  constructor(private readonly themeService: ThemeService) {}

  public getBaseHost(props: GetHostClassesProps): string[] {
    const classes: string[] = [];

    classes.push(
      css`
        content: '';
        overflow: hidden;
        width: 100%;
        box-sizing: border-box;
        padding: 0px 0px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color 0.2s ease-out, flex 0.5s ease-out;

        .text {
          display: block;
          content: '';
          white-space: nowrap;
          ${OVERFLOW_ELLIPSIS_STYLE};
          overflow: hidden;
          font-size: 0.8rem;
          color: ${this.themeService.getColor(['light', 100])};
        }
      `
    );

    classes.push(
      css`
        flex: 0 0 ${props.width}%;
      `
    );

    classes.push(
      css`
        background-color: ${props.isVoid ? 'transparent' : this.themeService.getColor(['primary', 0])};
      `
    );

    if (!props.isVoid) {
      classes.push(css`
        cursor: pointer;

        :hover {
          background-color: ${this.themeService.getColor(['primary', 200])};
        }
      `);
    }

    return classes;
  }

  public readonly highlightHost: string = css`
    transition: 0s !important;
    background-color: ${this.themeService.getColor(['accent', 400])} !important;
  `;
}
