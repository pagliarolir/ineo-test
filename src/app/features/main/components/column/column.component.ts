import {Component, computed, DestroyRef, inject, input, OnInit, signal} from '@angular/core';
import {CardModule} from "primeng/card";
import {NoDataBoxComponent} from "../../../../shared/no-data-box/no-data-box.component";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {MultiSelectModule} from "primeng/multiselect";
import {Column} from "../../../../models/interfaces/column";
import {MultiFilterType} from "../../../../helpers/multi-filter";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {TaskService} from "../../../../services/task.service";
import {TaskComponent} from "../task/task.component";
import {HighlightDirective} from "../../../../directives/highlight.directive";
import {InputTextModule} from "primeng/inputtext";
import {Icons} from "../../../../models/enums/icons.enum";
import {RippleModule} from "primeng/ripple";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AddTaskOverlayComponent, AddTaskPayload} from "../add-task-overlay/add-task-overlay.component";
import {Tags} from "../../../../constants/tag-list";
import {Users} from "../../../../constants/users";
import {Task} from "../../../../models/interfaces/task";
import {JsonPipe} from "@angular/common";
import {Button} from "primeng/button";

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
    JsonPipe,
    Button,
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss'
})
export class ColumnComponent implements OnInit {

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

  tasks = computed(() => this.taskService.tasks().filter(task => task.column === this.column().id))

  ngOnInit() {
    this.taskService.getAllTasks()
  }

  /* Converts form's valuechanges into a signal */
  searchQuery = toSignal(this.search().valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef))
  )

  filteredTasks = computed(() => {
    /* Filter tasks: if searchQuery has a value, return only tasks with specified params (non-case-sensitive), else return the whole array */
    return this.searchQuery() ? this.tasks()?.filter(el => el.label.toLowerCase().includes(this.searchQuery()!.toLowerCase())) : this.tasks();
  })


  filterQuery = toSignal(this.filters().valueChanges)

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

  }
}
