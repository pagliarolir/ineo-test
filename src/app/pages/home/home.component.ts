import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MainComponent} from "../../features/main/main.component";

@Component({
  selector: 'it-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MainComponent],
  template: `
    <it-main/>`,
  styles: `
    :host {
      height: 100%;
    }`
})
export class HomeComponent {

}
