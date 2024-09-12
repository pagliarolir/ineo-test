import {Component, computed, EventEmitter, inject, input, Output} from '@angular/core';
import {SelectButtonModule} from "primeng/selectbutton";
import {Tag} from "@models/interfaces/tag";
import {User} from "@models/interfaces/user";
import {Task} from "@models/interfaces/task";
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersFormControlComponent} from "../users-form-control/users-form-control.component";
import {AddTaskPayload} from "@models/types/add-task-payload";

@Component({
  selector: 'it-manage-task',
  standalone: true,
  imports: [
    SelectButtonModule,
    InputTextModule,
    Button,
    TooltipModule,
    UsersFormControlComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './manage-task.component.html',
  styleUrl: './manage-task.component.scss'
})
export class ManageTaskComponent {

  private fb = inject(FormBuilder)

  tags = input<Tag[]>([])
  users = input<User[]>([])
  taskToEdit = input<Task>()

  @Output() onCreateTask = new EventEmitter<AddTaskPayload>()

  isEditMode = computed(() => !!this.taskToEdit())
  formGroup = computed(() => (this.fb.group({
    label: this.fb.control<string>(this.isEditMode() ? this.taskToEdit()?.label! : '', Validators.required),
    tags: this.fb.control<number[]>(this.isEditMode() ? this.taskToEdit()?.tags! : [], Validators.required),
    user: this.fb.control<User | null>(this.isEditMode() ? this.users().find(el => el.id === this.taskToEdit()?.userId)! : null, Validators.required)
  })))

  labelFormControl = computed(() => this.formGroup().controls.label)
  tagsFormControl = computed(() => this.formGroup().controls.tags)
  userFormControl = computed(() => this.formGroup().controls.user)

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
