import {ChangeDetectionStrategy, Component, EventEmitter, input, Output} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {Button} from "primeng/button";
import {DialogComponent} from "@shared/dialog/dialog.component";
import {Task} from "@models/interfaces/task";
import {ManageTaskComponent} from "../manage-task/manage-task.component";
import {Tag} from "@models/interfaces/tag";
import {User} from "@models/interfaces/user";
import {ManageTaskPayload} from "@models/types/manage-task-payload";

@Component({
  selector: 'it-edit-task-dialog',
  standalone: true,
  imports: [
    DialogModule,
    Button,
    DialogComponent,
    ManageTaskComponent
  ],
  templateUrl: './edit-task-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTaskDialogComponent {

  task = input.required<Task>()
  visible = input<boolean>(false)
  tags = input<Tag[]>([])
  users = input<User[]>([])

  @Output() close = new EventEmitter<void>()
  @Output() confirmEdit = new EventEmitter<ManageTaskPayload>()

  confirmEditTask(task: ManageTaskPayload) {
    this.confirmEdit.emit(task)
    this.close.emit()
  }
}
