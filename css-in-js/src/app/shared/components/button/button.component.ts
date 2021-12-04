import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComponentChanges } from '../../../declarations/interfaces/component-changes.interface';
import { map, take } from 'rxjs/operators';
import { updateByChanges } from '../../../functions/common/update-by-changes.function';
import { ButtonVariants } from 'src/app/declarations/types/button-variants.type';
import { ButtonClasses } from './button-classes.class';

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

  public readonly classes: ButtonClasses = new ButtonClasses(this.themeService);

  public styleClasses$: Observable<string[]> = this.inputs$.pipe(
    map((inputs: Inputs) => [this.classes.root, this.classes.getByVariant(inputs.variant)])
  );

  constructor(private readonly themeService: ThemeService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.updateInputs(changes);
  }

  private updateInputs(changes: ComponentChanges<this>): void {
    this.inputs$.pipe(take(1)).subscribe((previousInputs: Inputs) => {
      this.inputs$.next(updateByChanges(previousInputs, changes));
    });
  }
}
