import {Component, computed, DestroyRef, inject, input, signal} from '@angular/core';
import {CardModule} from "primeng/card";
import {NoDataBoxComponent} from "../../../../shared/no-data-box/no-data-box.component";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {MultiSelectModule} from "primeng/multiselect";
import {Column} from "../../../../models/interfaces/column";
import {MultiFilterType} from "../../../../helpers/multi-filter";
import {debounceTime, distinctUntilChanged, filter, switchMap} from "rxjs";
import {takeUntilDestroyed, toObservable, toSignal} from "@angular/core/rxjs-interop";
import {TaskService} from "../../../../services/task.service";
import {TaskComponent} from "../task/task.component";
import {HighlightDirective} from "../../../../directives/highlight.directive";
import {InputTextModule} from "primeng/inputtext";
import {Icons} from "../../../../models/enums/icons.enum";
import {RippleModule} from "primeng/ripple";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AddTaskOverlayComponent} from "../add-task-overlay/add-task-overlay.component";
import {Tags} from "../../../../constants/tag-list";
import {Users} from "../../../../constants/users";

@Component({
  selector: 'it-column',
  standalone: true,
  imports: [
    CardModule,
    NoDataBoxComponent,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    TaskComponent,
    HighlightDirective,
    InputTextModule,
    RippleModule,
    OverlayPanelModule,
    AddTaskOverlayComponent,
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss'
})
export class ColumnComponent {

  private fb = inject(FormBuilder)
  private destroyRef = inject(DestroyRef)
  private taskService = inject(TaskService)

  column = input.required<Column>()

  formGroup = signal(this.fb.group({
    search: this.fb.control<string>(''),
    filters: this.fb.control<MultiFilterType<string>[]>([])
  }))

  /* Form Control Getter */
  search = computed(() => this.formGroup().controls.search)
  filters = computed(() => this.formGroup().controls.filters)

  filterOptions = signal<MultiFilterType<string>[]>([])
  Icons = Icons
  Tags = Tags
  Users = Users

  /* Get task list for each column
   * Convert column in an observable in order to provide its ID to getTasksByColumn
   */
  tasks =
    toSignal(toObservable<Column>(this.column)
      .pipe(
        filter((col => !!col.id)),
        switchMap((col) => this.taskService.getTasksByColumn(col.id)))
    );

  /* Converts form's value changes into a signal */
  searchQuery = toSignal(this.search().valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef))
  )

  filteredTasks = computed(() => {
    /* Filter tasks: if searchQuery has a value, return only tasks with specified params (non case-sensitive), else return the whole array */
    return this.searchQuery() ? this.tasks()?.filter(el => el.label.toLowerCase().includes(this.searchQuery()!.toLowerCase())) : this.tasks();
  })


  filterQuery = toSignal(this.filters().valueChanges)

  onAddTask(event: any) {
    this.taskService.addTask({...event, column: this.column().id, userId: event.user.id})
      .pipe(
        switchMap(({column}: any) => this.taskService.getTasksByColumn(column))
      ).subscribe()
  }
}
