import {ChangeDetectionStrategy, Component, EventEmitter, input, Output} from '@angular/core';
import {Task} from "@models/interfaces/task";
import {HighlightDirective} from "@directives/highlight.directive";
import {Button} from "primeng/button";
import {Icons} from "@models/enums/icons.enum";

@Component({
  selector: 'it-task',
  standalone: true,
  imports: [
    HighlightDirective,
    Button
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {

  task = input.required<Task>()
  Icons = Icons;

  @Output() onEditTask = new EventEmitter<void>()
  @Output() onDeleteTask = new EventEmitter<void>()
}
