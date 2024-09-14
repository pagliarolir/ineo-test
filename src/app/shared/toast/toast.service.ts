import {Injectable, signal} from '@angular/core';
import {ToastSeverity} from "@constants/toast-severity";
import {take, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  /* Manage Toast open / close state */
  public isToastOpen = signal<boolean>(false)

  /* Message to be shown inside the toast */
  public toastMessage = signal<string>('')

  // The state that will add a style class to the component  .
  public toastSeverity = signal<string>(ToastSeverity.SUCCESS)

  showToast(toastSeverity: string, toastMsg: string): void {

    this.toastSeverity.set(toastSeverity);

    this.toastMessage.set(toastMsg);

    this.isToastOpen.set(true);

    timer(4000).pipe(
      take(1)) /* After first value, complete observable and unsubscribe */
      .subscribe(() => this.dismissToast());
  }

  dismissToast(): void {
    this.isToastOpen.set(false);
  }
}
