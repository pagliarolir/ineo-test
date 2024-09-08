import {Component, HostBinding, input} from '@angular/core'
import {NgClass} from "@angular/common";

@Component({
  selector: 'it-no-data-box',
  standalone: true,
  imports: [NgClass],
  template: `
    <ng-content></ng-content>
    <span class="primary big bolder center" [ngClass]="{'uppercase': uppercase()}">{{ label() }}</span>
  `,
  styleUrl: './no-data-box.component.scss',
})
export class NoDataBoxComponent {
  label = input.required<string>()
  padding = input<number>(1)
  minHeight = input<number>()
  uppercase = input<boolean>(false)

  @HostBinding('style.padding')
  get paddingValue() {
    return `${this.padding()}rem`
  }

  @HostBinding('style.min-height')
  get minHeightValue() {
    return `${this.minHeight()}rem`
  }
}
