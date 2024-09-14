import {ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, signal} from '@angular/core';
import {User} from "@models/interfaces/user";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NgClass, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'it-users-form-control',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage
  ],
  template: `
    <div class="avatars">
      @for (user of users(); track user.id) {
        <img class="avatar"
             alt=""
             [src]="user.picture"
             [ngClass]="{'selected': $index === selectedUserIndex()}"
             [style.z-index]="getZIndex($index)"
             (click)="setValue(user, $index)"
        />
      }
    </div>
  `,
  styleUrl: './users-form-control.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: UsersFormControlComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersFormControlComponent implements ControlValueAccessor {

  private element = inject(ElementRef)

  users = input<User[]>([])

  value = signal<User | null>(null)
  disabled = signal(false)

  /* CVA Implementation in order to force this component to behave like a Form Control */
  onChange: (value: User) => void = () => {
  }
  onTouched: () => void = () => {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled)
  }

  writeValue(obj: User): void {
    this.value.set({...obj})
  }

  setValue(user: User, index: number) {
    if (this.disabled()) {
      return
    }
    this.value.set(user)
    if (this.value()) {
      this.onChange(this.value()!)
      // This
      this.selectedUserIndex.set(index);
    }
    this.onTouched()
  }


  /* Calc. users length and set correspondent css variable. This is for styling purpose */
  usersNumber = effect(() => this.element.nativeElement.style.setProperty('--users-no', this.users().length))

  selectedUserIndex = signal<number | null>(null)

  /* Calc z-index to be assigned to users based on users number.
   * This method is only for styling purpose
   * */
  getZIndex(index: number): number {
    const maxZIndex = this.users().length;

    if (this.selectedUserIndex() === null) {
      return maxZIndex - index; // Z-index decreases according to position
    }

    const distanceFromSelected = Math.abs(index - this.selectedUserIndex()!);
    return Math.max(1, maxZIndex - distanceFromSelected);
  }
}
