import { TestBed } from '@angular/core/testing';
import { CalendarRemovalComponent } from './calendar-removal.component';

describe('calendar removal confirmation', () => {
  function open() {
    const fixture = TestBed.createComponent(CalendarRemovalComponent);
    fixture.componentRef.setInput('prompt', 'Delete Calendar?');
    fixture.detectChanges();
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    trigger.focus();
    trigger.click();
    fixture.detectChanges();
    const dialog: HTMLDialogElement = fixture.nativeElement.querySelector('dialog');
    return {fixture, trigger, dialog};
  }

  it('cancels the modal and keeps the original action available', () => {
    const {fixture, trigger, dialog} = open();
    const confirmed = jasmine.createSpy();
    fixture.componentInstance.confirmed.subscribe(confirmed);
    expect(dialog.matches(':modal')).toBeTrue();
    dialog.dispatchEvent(new Event('cancel', {cancelable: true}));
    fixture.detectChanges();
    expect(confirmed).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('runs the destructive action only after confirmation and clears that choice', () => {
    const {fixture, dialog} = open();
    const states: boolean[] = [];
    const component = fixture.componentInstance;
    component.confirmed.subscribe(() => states.push(component.confirming()));
    dialog.querySelector<HTMLButtonElement>('.destructive')!.click();
    fixture.detectChanges();
    expect(states).toEqual([true]);
    expect(component.confirming()).toBeFalse();
    expect(fixture.nativeElement.querySelector('dialog')).toBeNull();
  });
});
