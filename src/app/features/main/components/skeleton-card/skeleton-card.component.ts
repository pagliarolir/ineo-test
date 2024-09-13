import {Component} from '@angular/core';
import {SkeletonModule} from "primeng/skeleton";
import {Button} from "primeng/button";

@Component({
  selector: 'it-skeleton-card',
  standalone: true,
  imports: [
    SkeletonModule,
    Button
  ],
  template: `
    <div class="tags-wrapper">
      <p-skeleton class="tag"></p-skeleton>
      <p-skeleton class="tag"></p-skeleton>
      <p-skeleton class="tag"></p-skeleton>
    </div>
    <p-skeleton class="task-label"></p-skeleton>
    <div class="bottom">
      <p-skeleton></p-skeleton>
    </div>
  `,
  styleUrl: './skeleton-card.component.scss'
})
export class SkeletonCardComponent {

}
