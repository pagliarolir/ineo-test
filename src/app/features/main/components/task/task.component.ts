import {Component, EventEmitter, input, Output} from '@angular/core';
import {Task} from "../../../../models/interfaces/task";
import {NgClass} from "@angular/common";
import {HighlightDirective} from "../../../../directives/highlight.directive";

@Component({
  selector: 'it-task',
  standalone: true,
  imports: [
    NgClass,
    HighlightDirective
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

  task = input.required<Task>()

  @Output() onSelectTask = new EventEmitter<void>()
}
