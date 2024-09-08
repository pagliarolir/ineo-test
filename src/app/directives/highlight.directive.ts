import {Directive, ElementRef, HostListener, inject, Input} from "@angular/core";

@Directive({
  selector: '[highlight]',
  standalone: true,
})
export class HighlightDirective {
  private element = inject(ElementRef);
  @Input('highlight') highlight: boolean = true;

  @HostListener('mouseenter') onMouseEnter() {
    this.setTransform('translate(-1px, -1px)');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setTransform('translate(0, 0)');
  }

  private setTransform(value: string) {
    if (this.highlight) {
      this.element.nativeElement.style.transform = value;
    }
  }
}
