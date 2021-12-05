import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComponentChanges } from '../../../declarations/interfaces/component-changes.interface';
import { take } from 'rxjs/operators';
import { updateByChanges } from '../../../functions/common/update-by-changes.function';
import { ButtonVariants } from 'src/app/declarations/types/button-variants.type';

interface Inputs {
  variant: ButtonVariants;
}

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnChanges {
  @Input() variant: ButtonVariants = 'primary';

  public readonly inputs$: BehaviorSubject<Inputs> = new BehaviorSubject<Inputs>({
    variant: this.variant
  });

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.updateInputs(changes);
  }

  private updateInputs(changes: ComponentChanges<this>): void {
    this.inputs$.pipe(take(1)).subscribe((previousInputs: Inputs) => {
      this.inputs$.next(updateByChanges(previousInputs, changes));
    });
  }
}
