import {ChangeDetectionStrategy, Component, EventEmitter, input, Output} from '@angular/core';
import {DialogComponent} from "@shared/dialog/dialog.component";
import {ManageTaskComponent} from "../manage-task/manage-task.component";
import {Button} from "primeng/button";

@Component({
  selector: 'it-delete-task-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    ManageTaskComponent,
    Button
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-delete-task-dialog.component.html',
  styles: `
    :host {
      position: absolute;

      .dialog-content {
        min-height: 6rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }`
})
export class ConfirmDeleteDialogComponent {

  visible = input<boolean>(false)

  @Output() close = new EventEmitter<void>()
  @Output() confirmDelete = new EventEmitter<void>()
}
