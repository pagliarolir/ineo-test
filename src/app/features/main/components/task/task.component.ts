import {Component, EventEmitter, input, Output} from '@angular/core';
import {Task} from "../../../../models/interfaces/task";
import {NgClass} from "@angular/common";
import {HighlightDirective} from "../../../../directives/highlight.directive";
import {Button} from "primeng/button";
import {Icons} from "../../../../models/enums/icons.enum";

@Component({
  selector: 'it-task',
  standalone: true,
  imports: [
    NgClass,
    HighlightDirective,
    Button
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

  task = input.required<Task>()
  Icons = Icons;

  @Output() onEditTask = new EventEmitter<void>()
  @Output() onDeleteTask = new EventEmitter<void>()
}
