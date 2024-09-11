import {Component} from '@angular/core';
import {SkeletonModule} from "primeng/skeleton";

@Component({
  selector: 'it-skeleton-card',
  standalone: true,
  imports: [
    SkeletonModule
  ],
  template: `
    <p-skeleton class="skeleton-card"/>
  `,
  styleUrl: './skeleton-card.component.scss'
})
export class SkeletonCardComponent {

}
