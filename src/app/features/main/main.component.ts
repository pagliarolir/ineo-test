import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {ColumnComponent} from "./components/column/column.component";
import {ColumnsService} from "@services/columns.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {TaskService} from "@services/task.service";
import {CardModule} from "primeng/card";
import {DragDropModule} from "primeng/dragdrop";

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
  columns = toSignal(this.columnService.getAllColumns())
  taskToDrop = this.taskService.taskToDrop

  ngOnInit() {
    this.taskService.getAllTasks()
  }

  onDropTask(columnId: number) {
    if (this.taskToDrop()) {
      this.taskService.editTaskColumn(this.taskToDrop()!, columnId)
    }
  }
}
