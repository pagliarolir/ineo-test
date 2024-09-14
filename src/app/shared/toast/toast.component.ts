import {Component, HostBinding, inject} from '@angular/core';
import {ToastService} from "@shared/toast/toast.service";

@Component({
  selector: 'it-toast',
  standalone: true,
  imports: [],
  template: `{{ toastMessage() }}`,
  styleUrl: './toast.component.scss',
})
export class ToastComponent {

  private toastService = inject(ToastService)

  isToastOpen = this.toastService.isToastOpen
  toastMessage = this.toastService.toastMessage
  toastSeverity = this.toastService.toastSeverity

  /* Set is-open class when isToastOpen is true */
  @HostBinding('class.is-open')
  get isOpen(): boolean {
    return this.isToastOpen()
  }

  /* HostBinding set severity class according to toastSeverity value */
  @HostBinding('class')
  get severityClass(): string {
    return this.toastSeverity()
  }
}
