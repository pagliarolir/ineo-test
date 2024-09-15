import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  HostBinding,
  input,
  Output,
  signal
} from '@angular/core';
import {Task} from "@models/interfaces/task";
import {HighlightDirective} from "@directives/highlight.directive";
import {Button} from "primeng/button";
import {Icons} from "@models/enums/icons.enum";
import {Tags} from "@constants/tag-list";
import {Users} from "@constants/users";
import {animate, style, transition, trigger} from "@angular/animations";
import {ManageTaskComponent} from "../manage-task/manage-task.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";
import {EditTaskDialogComponent} from "../edit-task-dialog/edit-task-dialog.component";
import {DatePipe, I18nPluralPipe} from "@angular/common";

const transitionValue = '400ms cubic-bezier(0.86, 0, 0.07, 1)'

@Component({
  selector: 'it-task',
  standalone: true,
  imports: [
    HighlightDirective,
    Button,
    ManageTaskComponent,
    OverlayPanelModule,
    ConfirmDeleteDialogComponent,
    EditTaskDialogComponent,
    I18nPluralPipe,
    DatePipe,
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),  /* Hidden at first */
        animate(transitionValue, style({opacity: 1}))  /* Animate enter in the DOM */
      ]),
      transition(':leave', [
        animate(transitionValue, style({opacity: 0}))  /* Animate leaving in the DOM */
      ])
    ])
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {

  task = input.required<Task>()
  tags = computed(() => Tags.filter(tag => this.task().tags.includes(tag.id)))
  getUser = computed(() => Users.find(el => el.id === this.task().userId))
  isExpanded = signal<boolean>(false)
  Icons = Icons;

  @Output() onEditTask = new EventEmitter<void>()
  @Output() onDeleteTask = new EventEmitter<void>()
  @Output() showDetailedView = new EventEmitter<void>()

  toggleExpand() {
    this.isExpanded.update(expanded => !expanded)
  }

  getUserLabel = computed(() => `${this.getUser()?.firstName.slice(0, 1).toUpperCase()}. ${this.getUser()?.lastName}`)

  @HostBinding('style') get getExpandedStyle() {
    const vh = this.isExpanded() ? '25vh' : '15vh';
    return ({minHeight: vh})
  }

  /* Just a random date in 2024 to be bound into the template */
  randomDate = signal(this.getRandomDateIn2024())

  getRandomDateIn2024() {
    const year = 2024;
    const startDate = new Date(year, 0, 1); /*1 Jan 2024 */
    const endDate = new Date(year + 1, 0, 1); /*1 Jan 2025 */

    /* Get a random ms number between previous dates */
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());

    return new Date(randomTime);
  }
}
