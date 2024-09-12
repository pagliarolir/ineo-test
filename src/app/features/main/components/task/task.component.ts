import {ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output} from '@angular/core';
import {Task} from "@models/interfaces/task";
import {HighlightDirective} from "@directives/highlight.directive";
import {Button} from "primeng/button";
import {Icons} from "@models/enums/icons.enum";
import {Tags} from "@constants/tag-list";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'it-task',
  standalone: true,
  imports: [
    HighlightDirective,
    Button,
    JsonPipe
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {

  task = input.required<Task>()
  tags = computed(() => Tags.filter(tag => this.task().tags.includes(tag.id)))
  Icons = Icons;

  @Output() onEditTask = new EventEmitter<void>()
  @Output() onDeleteTask = new EventEmitter<void>()
}
