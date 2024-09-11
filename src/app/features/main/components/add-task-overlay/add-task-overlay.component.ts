import {Component, computed, effect, ElementRef, EventEmitter, inject, input, Output, signal} from '@angular/core';
import {SelectButtonModule} from "primeng/selectbutton";
import {Tag} from "../../../../models/interfaces/tag";
import {User} from "../../../../models/interfaces/user";
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersFormControlComponent} from "../users-form-control/users-form-control.component";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'it-add-task-overlay',
  standalone: true,
  imports: [
    SelectButtonModule,
    InputTextModule,
    Button,
    TooltipModule,
    UsersFormControlComponent,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './add-task-overlay.component.html',
  styleUrl: './add-task-overlay.component.scss'
})
export class AddTaskOverlayComponent {

  private fb = inject(FormBuilder)
  private element = inject(ElementRef)

  tags = input<Tag[]>([])
  users = input<User[]>([])

  @Output() onCreateTask = new EventEmitter<AddTaskPayload>()

  formGroup = signal(this.fb.group({
    label: this.fb.control<string>('', Validators.required),
    tags: this.fb.control<number[]>([], Validators.required),
    user: this.fb.control<User | null>(null, Validators.required)
  }))

  labelFormControl = computed(() => this.formGroup().controls.label)
  tagsFormControl = computed(() => this.formGroup().controls.tags)
  userFormControl = computed(() => this.formGroup().controls.user)

  setUsersNumber = effect(() => this.element.nativeElement.style.setProperty('--users-no', this.users().length))

  getUserFullName() {
    return this.userFormControl().value
      ? `${this.userFormControl().value?.firstName} ${this.userFormControl().value?.lastName}`
      : ''
  }

  createTask() {
    const payload: AddTaskPayload = {
      label: this.labelFormControl().value!,
      user: this.userFormControl().value,
      tags: this.tagsFormControl().value!
    }
    this.onCreateTask.emit(payload)
    this.formGroup().reset()
  }
}

export type AddTaskPayload = { user: User | null, label: string, tags: number[] }
