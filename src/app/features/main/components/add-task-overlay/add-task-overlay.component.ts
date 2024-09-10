import {Component, effect, ElementRef, inject, input} from '@angular/core';
import {SelectButtonModule} from "primeng/selectbutton";
import {Tag} from "../../../../models/interfaces/tag";
import {User} from "../../../../models/interfaces/user";
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";

@Component({
  selector: 'it-add-task-overlay',
  standalone: true,
  imports: [
    SelectButtonModule,
    InputTextModule,
    Button
  ],
  templateUrl: './add-task-overlay.component.html',
  styleUrl: './add-task-overlay.component.scss'
})
export class AddTaskOverlayComponent {

  private element = inject(ElementRef)
  tags = input<Tag[]>([])
  users = input<User[]>([])

  setUsersNumber = effect(() => this.element.nativeElement.style.setProperty('--users-no', this.users().length))
}
