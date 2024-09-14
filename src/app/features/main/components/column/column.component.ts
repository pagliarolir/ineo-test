import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal} from '@angular/core'
import {CardModule} from "primeng/card"
import {NoDataBoxComponent} from "@shared/no-data-box/no-data-box.component"
import {FormBuilder, ReactiveFormsModule} from "@angular/forms"
import {IconFieldModule} from "primeng/iconfield"
import {InputIconModule} from "primeng/inputicon"
import {Column} from "@models/interfaces/column"
import {debounceTime, distinctUntilChanged} from "rxjs"
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop"
import {TaskService} from "@services/task.service"
import {TaskComponent} from "../task/task.component"
import {HighlightDirective} from "@directives/highlight.directive"
import {InputTextModule} from "primeng/inputtext"
import {Icons} from "@models/enums/icons.enum"
import {RippleModule} from "primeng/ripple"
import {OverlayPanelModule} from "primeng/overlaypanel"
import {ManageTaskComponent} from "../manage-task/manage-task.component"
import {Tags} from "@constants/tag-list"
import {Users} from "@constants/users"
import {Task} from "@models/interfaces/task"
import {Button} from "primeng/button"
import {SortingOrderEnum} from "@models/enums/sorting-order";
import {TypedObjectFromEnum} from "@helpers/typed-object-from-enum";
import {SortParams} from "@models/types/sort-params";
import {SkeletonCardComponent} from "../skeleton-card/skeleton-card.component";
import {ManageTaskPayload} from "@models/types/manage-task-payload";
import {EditTaskDialogComponent} from "../edit-task-dialog/edit-task-dialog.component";
import {DragDropModule} from "primeng/dragdrop";

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
    ManageTaskComponent,
    Button,
    SkeletonCardComponent,
    EditTaskDialogComponent,
    DragDropModule,
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnComponent {

  private fb = inject(FormBuilder)
  private destroyRef = inject(DestroyRef)
  protected taskService = inject(TaskService)
  Icons = Icons
  Tags = Tags
  Users = Users

  column = input.required<Column>()
  tasks = computed(() => this.taskService.tasks().filter(task => task.column === this.column().id))
  sortParams = signal<SortParams>({
    order: SortingOrderEnum.NO_SORT,
    icon: Icons.SORT_ALT
  })

  /* Edit task variables */
  showEditTaskDialog = signal<boolean>(false)
  taskToEdit = signal<Task | null>(null)

  /* Drag Task variables */
  taskToDrag = this.taskService.taskToDrop

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
    const filteredTasks = this.searchQuery() ? this.tasks()?.filter(el => el.label.toLowerCase().includes(this.searchQuery()!.toLowerCase())) : this.tasks()

    /* Sort Tasks based on sortingOrder */
    if (this.sortParams().order === SortingOrderEnum.ASC) {
      return filteredTasks?.toSorted((a, b) => a.label.localeCompare(b.label))
    } else if (this.sortParams().order === SortingOrderEnum.DESC) {
      return filteredTasks?.toSorted((a, b) => b.label.localeCompare(a.label))
    }
    /* If there's no sorting order, return only filtered tasks array */
    return [...filteredTasks]
  })

  skeletonCardsNo = signal<number[]>(Array.from(new Set(Array.from({length: Math.floor(Math.random() * 3) + 2}, () => Math.floor(Math.random() * 100)))))

  /* Toggle sort method */
  toggleSort() {
    /* Build a map where the key is each SortingOrderEnum value
     * And the value are the corresponding params */
    const sortMap: TypedObjectFromEnum<SortingOrderEnum, SortParams> = {
      [SortingOrderEnum.ASC]: {order: SortingOrderEnum.DESC, icon: Icons.SORT_ALPHA_DOWN},
      [SortingOrderEnum.DESC]: {order: SortingOrderEnum.NO_SORT, icon: Icons.SORT_ALT},
      [SortingOrderEnum.NO_SORT]: {order: SortingOrderEnum.ASC, icon: Icons.SORT_ALPHA_UP},
    }
    /* Update params on toggle, assigning to the object the next key */
    this.sortParams.update(obj => sortMap[obj.order])
  }

  createTask(event: ManageTaskPayload) {
    const body: Omit<Task, 'id'> = {
      userId: event.user?.id!,
      column: this.column().id,
      tags: event.tags,
      label: event.label
    }
    this.taskService.addTask(body)
  }

  openEditTaskDialog(task: Task) {
    this.taskToEdit.set(task)
    this.showEditTaskDialog.set(true)
  }

  editTask(event: ManageTaskPayload) {
    const body: Task = {
      userId: event.user?.id!,
      tags: event.tags,
      label: event.label,
      column: this.column().id,
      id: this.taskToEdit()?.id!
    }
    this.taskService.editTask(body)
    this.closeEditTaskDialog()
  }

  closeEditTaskDialog() {
    this.taskToEdit.set(null)
    this.showEditTaskDialog.set(false)
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task.id)
  }

  dragStart(task: Task) {
    this.taskToDrag.set({...task})
  }
}
