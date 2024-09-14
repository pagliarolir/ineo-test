import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastComponent} from "@shared/toast/toast.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <it-toast/>
    <router-outlet/>
  `,
  styles: `:host {
    height: 100%;
    display: block;
  }`
})
export class AppComponent {
}
