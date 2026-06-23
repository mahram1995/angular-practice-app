import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appEnterToNext]'
})
export class EnterToNextDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keydown.enter', ['$event'])
  handleEnter(event: Event) {
    event.preventDefault();

    const focusableElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        `
        input:not([type="hidden"]),
        select,
        textarea,
        button,
        [tabindex]:not([tabindex="-1"])
        `
      )
    )
      .filter(el => this.isVisible(el) && this.isEnabled(el));

    const currentIndex = focusableElements.indexOf(
      document.activeElement as HTMLElement
    );

    if (currentIndex > -1 && currentIndex < focusableElements.length - 1) {
      const nextElement = focusableElements[currentIndex + 1];
      nextElement.focus();

      // optional: move cursor to end for input fields
      if (nextElement instanceof HTMLInputElement) {
        const len = nextElement.value?.length || 0;
        nextElement.setSelectionRange(len, len);
      }
    }
  }

  private isVisible(el: HTMLElement): boolean {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  private isEnabled(el: HTMLElement): boolean {
    const htmlEl = el as HTMLInputElement | HTMLButtonElement | HTMLSelectElement;

    return (
      !htmlEl.hasAttribute('disabled') &&
      !htmlEl.hasAttribute('readonly')
    );
  }
}