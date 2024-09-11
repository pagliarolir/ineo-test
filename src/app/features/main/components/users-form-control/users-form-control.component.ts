import {Component, input, signal} from '@angular/core';
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
             [ngClass]="{'selected': this.value()?.id === user.id}"
             [src]="user.picture"
             (click)="setValue(user)"
        />
      }
    </div>
  `,
  styleUrl: './users-form-control.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: UsersFormControlComponent,
    multi: true
  }]
})
export class UsersFormControlComponent implements ControlValueAccessor {

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

  setValue(user: User) {
    if (this.disabled()) {
      return
    }
    this.value.set(user)
    if (this.value()) {
      this.onChange(this.value()!)
    }
    this.onTouched()
  }
}
