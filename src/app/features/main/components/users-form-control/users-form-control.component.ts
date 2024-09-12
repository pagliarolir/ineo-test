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
             [ngClass]="{'selected': this.value()?.id === user.id, 'sibling': this.isDirectSibling(user)}"
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

  /* Check if an element has direct sibling among all the users in the array
   * This method is only for styling purpose */
  isDirectSibling(user: User): boolean {
    //Return if no user is selected
    if (!this.value()?.id) return false;
    //Find selected user's ID in the array
    const index = this.users().indexOf(this.value()!);
    return (
      /* Check if it has a previous sibling.
       * index > 0 implies it's not the first element in the array
       * Then check if the past user the provided user
       */
      (index > 0 && this.users()[index - 1].id === user.id) ||
      /* Check if it has a next sibling.
       * index this.users().length - 1 implies it's not the last element in the array
       * Then check if the next user the provided user
       */
      (index < this.users().length - 1 && this.users()[index + 1].id === user.id)
    );
  }

  /* Calc. users length and set correspondent css variable. This method is for styling purpose */
  usersNumber = effect(() => this.element.nativeElement.style.setProperty('--users-no', this.users().length))
}
