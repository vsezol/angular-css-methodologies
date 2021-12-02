import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { css } from '@emotion/css';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComponentChanges } from '../../../declarations/interfaces/component-changes.interface';
import { map, take } from 'rxjs/operators';
import { updateByChanges } from '../../../functions/common/update-by-changes.function';
import { ButtonVariants } from 'src/app/declarations/types/button-variants.type';

interface Inputs {
  variant: ButtonVariants;
}

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnChanges {
  @Input() variant: ButtonVariants = 'primary';

  private readonly inputs$: BehaviorSubject<Inputs> = new BehaviorSubject<Inputs>({
    variant: this.variant
  });

  public styleClasses$: Observable<string[]> = this.inputs$.pipe(map((inputs: Inputs) => this.getClasses(inputs)));

  constructor(private readonly themeService: ThemeService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.updateInputs(changes);
  }

  private updateInputs(changes: ComponentChanges<this>): void {
    this.inputs$.pipe(take(1)).subscribe((previousInputs: Inputs) => {
      this.inputs$.next(updateByChanges(previousInputs, changes));
    });
  }

  private getClasses(inputs: Inputs): string[] {
    return [
      css`
        cursor: pointer;
        transition: all 0.2s;
        height: 35px;
        min-width: 70px;
        box-sizing: border-box;
        color: ${this.themeService.getColor('light')};
        border: none;
      `,
      this.getClassByVariant(inputs.variant)
    ];
  }

  private getClassByVariant(variant: ButtonVariants): string {
    const classesByVariant: { [key in ButtonVariants]: string } = {
      primary: css`
        background-color: ${this.themeService.getColor('primary')};

        :hover {
          background-color: ${this.themeService.getColor(['primary', 100])};
        }
      `,
      secondary: css`
        background-color: ${this.themeService.getColor(['secondary', 500])};

        :hover {
          background-color: ${this.themeService.getColor(['secondary', 400])};
        }
      `,
      danger: css`
        background-color: ${this.themeService.getColor('danger')};

        :hover {
          background-color: ${this.themeService.getColor(['danger', 100])};
        }
      `
    };

    return classesByVariant[variant];
  }
}
