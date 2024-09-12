import {Component, computed, EventEmitter, input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {PrimeTemplate} from "primeng/api";

@Component({
  selector: 'it-dialog',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    PrimeTemplate
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  visible = input<boolean>(false)
  disableConfirm = input<boolean>(false)
  hasFooter = input<boolean>(false)
  title = input<string>('')
  titleParam = input<string>()
  width = input<number>(30)
  canConfirm = input<boolean>(true)
  canClose = input<boolean>(true)
  confirmLabel = input<string>('Conferma')
  cancelLabel = input<string>('Chiudi')

  getStyle = computed(() => ({
    width: `${this.width()}vw`
  }))

  @Output() confirm = new EventEmitter<void>()
  @Output() close = new EventEmitter<void>()
}
