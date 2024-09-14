import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {ColumnComponent} from "./components/column/column.component";
import {ColumnsService} from "@services/columns.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {TaskService} from "@services/task.service";
import {CardModule} from "primeng/card";
import {DragDropModule} from "primeng/dragdrop";
import {ToastService} from "@shared/toast/toast.service";
import {ToastSeverity} from "@constants/toast-severity";

@Component({
  selector: 'it-main',
  standalone: true,
  imports: [ColumnComponent, CardModule, DragDropModule,],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (column of columns(); track column.id) {
      <it-column
        pDroppable
        [column]="column"
        (onDrop)="onDropTask(column.id)"
      />
    }
  `,
  styles: `:host {
    padding: 1rem;
    height: 100%;
    gap: 1rem;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: minmax(0, 1fr);
  }`
})
export class MainComponent implements OnInit {

  private taskService = inject(TaskService)
  private columnService = inject(ColumnsService)
  private toastService = inject(ToastService)

  columns = toSignal(this.columnService.getAllColumns())
  dragDropTask = this.taskService.dragDropTask

  ngOnInit() {
    this.taskService.getAllTasks()
  }

  /* When a drop event occurs, trigger edit task's column */
  onDropTask(columnId: number) {
    if (!this.dragDropTask()) return

    if (columnId === this.dragDropTask()?.column) {
      this.toastService.showToast(ToastSeverity.WARNING, 'Il task si trova già in questa colonna...')
      return
    }
    this.taskService.editTaskColumn(this.dragDropTask()!, columnId)
  }
}
