import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ThemeService } from 'src/app/services/theme.service';
import { BehaviorSubject } from 'rxjs';
import { Nullable } from '../../../declarations/types/nullable.type';
import { filter, take } from 'rxjs/operators';
import { isNotNil } from '../../../functions/common/is-not-nil.function';
import { InputClasses } from './input-classes.class';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('inputElement') public inputElement!: ElementRef;
  private readonly inputElement$: BehaviorSubject<Nullable<ElementRef>> = new BehaviorSubject<Nullable<ElementRef>>(
    null
  );

  @Output() public focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() public blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() public enter: EventEmitter<Event> = new EventEmitter<Event>();

  public readonly isFocused$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<Nullable<boolean>>(null);

  public readonly classes: InputClasses = new InputClasses(this.themeService);

  private _value: unknown;

  get value() {
    return this._value;
  }

  @Input()
  set value(value: unknown) {
    this._value = value;
    this.onChange(this._value);
  }

  @HostBinding('class')
  public readonly hostClass: string = this.classes.host;

  constructor(private readonly themeService: ThemeService) {}

  public ngAfterViewInit(): void {
    if (isNotNil(this.inputElement)) {
      this.inputElement$.next(this.inputElement);
    }
  }

  public emitFocusEvent(focusEvent: FocusEvent): void {
    this.isFocused$.next(true);
    this.focus.emit(focusEvent);
  }

  public emitBlurEvent(blurEvent: FocusEvent): void {
    this.isFocused$.next(false);
    this.blur.emit(blurEvent);
  }

  public emitEnterEvent(enterEvent: Event): void {
    this.enter.emit(enterEvent);
  }

  public doBlur(): void {
    this.inputElement$.pipe(take(1), filter(isNotNil)).subscribe((element: ElementRef) => {
      element.nativeElement.blur();
    });
  }

  public doFocus(): void {
    this.inputElement$.pipe(take(1), filter(isNotNil)).subscribe((element: ElementRef) => {
      element.nativeElement.focus();
    });
  }

  public onChange(value: unknown): void {}

  public writeValue(value: unknown): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(): void {}
}
