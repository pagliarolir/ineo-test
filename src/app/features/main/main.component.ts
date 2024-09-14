import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {ColumnComponent} from "./components/column/column.component";
import {ColumnsService} from "@services/columns.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {TaskService} from "@services/task.service";

@Component({
  selector: 'it-main',
  standalone: true,
  imports: [ColumnComponent,],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (column of columns(); track column.id) {
      <it-column [column]="column"/>
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

  ngOnInit() {
    this.taskService.getAllTasks()
  }
}
