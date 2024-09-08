import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet/>
  `,
  styles: `:host {
    height: 100%;
    display: flex;
    flex-direction: column;
  }`
})
export class AppComponent {
}
