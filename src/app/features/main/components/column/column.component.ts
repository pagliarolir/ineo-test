import {Component, computed, DestroyRef, inject, input, signal} from '@angular/core';
import {CardModule} from "primeng/card";
import {NoDataBoxComponent} from "../../../../shared/no-data-box/no-data-box.component";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {ChipsModule} from "primeng/chips";
import {MultiSelectModule} from "primeng/multiselect";
import {BadgeModule} from "primeng/badge";
import {Column} from "../../../../models/interfaces/column";
import {MultiFilterType} from "../../../../helpers/multi-filter";
import {debounceTime, distinctUntilChanged, filter, switchMap} from "rxjs";
import {takeUntilDestroyed, toObservable, toSignal} from "@angular/core/rxjs-interop";
import {TaskService} from "../../../../services/task.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {TaskComponent} from "../task/task.component";
import {HighlightDirective} from "../../../../directives/highlight.directive";

@Component({
  selector: 'it-column',
  standalone: true,
  imports: [
    CardModule,
    NoDataBoxComponent,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    ChipsModule,
    MultiSelectModule,
    BadgeModule,
    JsonPipe,
    TaskComponent,
    HighlightDirective,
    AsyncPipe
  ],
  templateUrl: './column.component.html',
  styles: `
    :host {
      flex: 0 1 25%;

      .tasks-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        height: 100%;
        padding: 1rem;
        overflow: auto;
      }
    }`
})
export class ColumnComponent {

  private fb = inject(FormBuilder)
  private destroyRef = inject(DestroyRef)
  private taskService = inject(TaskService)

  column = input.required<Column>()

  /* Get task list for each column
   * Convert column in an observable in order to provide it to getTasksByColumn
   */
  tasks =
    toSignal(toObservable<Column>(this.column)
      .pipe(
        filter((col => !!col.id)),
        switchMap((col) => this.taskService.getTasksByColumn(col.id))));

  searchQuery = toSignal(this.search().valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)))

  filterQuery = toSignal(this.filters().valueChanges)

  formGroup = signal(this.fb.group({
    search: this.fb.control<string>(''),
    filters: this.fb.control<MultiFilterType<string>[]>([])
  }))

  filterOptions = signal<MultiFilterType<string>[]>([])

  /* Form Control Getter */
  search = computed(() => this.formGroup().controls.search)
  filters = computed(() => this.formGroup().controls.filters)
}
