import {Component, computed, DestroyRef, inject, input, OnInit, signal} from '@angular/core'
import {CardModule} from "primeng/card"
import {NoDataBoxComponent} from "../../../../shared/no-data-box/no-data-box.component"
import {FormBuilder, ReactiveFormsModule} from "@angular/forms"
import {IconFieldModule} from "primeng/iconfield"
import {InputIconModule} from "primeng/inputicon"
import {Column} from "../../../../models/interfaces/column"
import {debounceTime, distinctUntilChanged} from "rxjs"
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop"
import {TaskService} from "../../../../services/task.service"
import {TaskComponent} from "../task/task.component"
import {HighlightDirective} from "../../../../directives/highlight.directive"
import {InputTextModule} from "primeng/inputtext"
import {Icons} from "../../../../models/enums/icons.enum"
import {RippleModule} from "primeng/ripple"
import {OverlayPanelModule} from "primeng/overlaypanel"
import {AddTaskOverlayComponent, AddTaskPayload} from "../add-task-overlay/add-task-overlay.component"
import {Tags} from "../../../../constants/tag-list"
import {Users} from "../../../../constants/users"
import {Task} from "../../../../models/interfaces/task"
import {Button} from "primeng/button"
import {SortingOrderEnum} from "../../../../models/enums/sorting-order";

@Component({
  selector: 'it-column',
  standalone: true,
  imports: [
    CardModule,
    NoDataBoxComponent,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    TaskComponent,
    HighlightDirective,
    InputTextModule,
    RippleModule,
    OverlayPanelModule,
    AddTaskOverlayComponent,
    Button,
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss'
})
export class ColumnComponent implements OnInit {

  private fb = inject(FormBuilder)
  private destroyRef = inject(DestroyRef)
  private taskService = inject(TaskService)
  Icons = Icons
  Tags = Tags
  Users = Users

  ngOnInit() {
    this.taskService.getAllTasks()
  }

  column = input.required<Column>()
  tasks = computed(() => this.taskService.tasks().filter(task => task.column === this.column().id))
  sortingOrder = signal<SortingOrderEnum | null>(null)
  sortIcon = signal<Icons>(Icons.SORT_ALT)

  formGroup = signal(this.fb.group({
    search: this.fb.control<string>(''),
  }))
  /* Form Control Getter */
  search = computed(() => this.formGroup().controls.search)

  /* Converts form's valuechanges into a signal */
  searchQuery = toSignal(this.search().valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef))
  )

  computedTasks = computed(() => {
    /* Filter tasks: if searchQuery has a value, return only tasks with specified params (non-case-sensitive), else return the whole array */
    const _tasks = this.searchQuery() ? this.tasks()?.filter(el => el.label.toLowerCase().includes(this.searchQuery()!.toLowerCase())) : this.tasks()

    /* Sort Tasks based on sortingOrder */
    if (this.sortingOrder() === SortingOrderEnum.ASC) {
      return _tasks?.sort((a, b) => a.label.localeCompare(b.label))
    } else if (this.sortingOrder() === SortingOrderEnum.DESC) {
      return _tasks?.sort((a, b) => b.label.localeCompare(a.label))
    }
    /* If sortingOrder status is null, return original tasks array */
    return [..._tasks]
  })

  createTask(event: AddTaskPayload) {
    const params: Omit<Task, 'id'> = {
      userId: event.user?.id!,
      column: this.column().id,
      tags: event.tags,
      label: event.label
    }
    this.taskService.addTask(params)
  }

  editTask(task: Task) {
    this.taskService.editTask(task)
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task.id)
  }

  toggleSort() {
    if (!this.sortingOrder()) {
      this.sortingOrder.set(SortingOrderEnum.ASC)
      this.sortIcon.set(Icons.SORT_ALPHA_DOWN)
    } else if (this.sortingOrder() === SortingOrderEnum.ASC) {
      this.sortingOrder.set(SortingOrderEnum.DESC)
      this.sortIcon.set(Icons.SORT_ALPHA_UP)
    } else {
      this.sortingOrder.set(null)
      this.sortIcon.set(Icons.SORT_ALT)
    }
  }
}
