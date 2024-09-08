import {Component, inject} from '@angular/core';
import {ColumnComponent} from "./components/column/column.component";
import {ColumnsService} from "../../services/columns.service";
import {AsyncPipe} from "@angular/common";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'it-main',
  standalone: true,
  imports: [
    ColumnComponent,
    AsyncPipe
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private columnService = inject(ColumnsService)
  columns = toSignal(this.columnService.getAllColumns())
}
