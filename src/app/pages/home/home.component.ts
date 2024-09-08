import {Component} from '@angular/core';
import {CardModule} from "primeng/card";
import {MainComponent} from "../../features/main/main.component";

@Component({
  selector: 'it-home',
  standalone: true,
  imports: [
    CardModule,
    MainComponent
  ],
  template: `
    <it-main/>`,
  styles: `
    :host {
      flex: 1;
      display: flex;
    }`
})
export class HomeComponent {

}
