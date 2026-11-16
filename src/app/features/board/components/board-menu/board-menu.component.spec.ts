import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BoardRegion } from '../../enums/board.enums';
import { BoardMenuCell, BoardMenuLabels } from '../../models/board.models';
import { BoardMenuComponent } from './board-menu.component';

const CELLS: BoardMenuCell[] = [
  { region: BoardRegion.About, label: 'About', gridColumn: 1, gridRow: 1, isActive: false },
  { region: BoardRegion.Hero, label: 'Home', gridColumn: 2, gridRow: 1, isActive: true },
  { region: BoardRegion.Projects, label: 'Projects', gridColumn: 2, gridRow: 2, isActive: false },
];

const LABELS: BoardMenuLabels = {
  open: 'menu',
  close: 'close',
  heading: 'the board',
  here: 'you are here',
  day: 'day',
  night: 'night',
  themeAction: 'Switch to day',
  admin: 'admin sign in',
};

describe('BoardMenuComponent', () => {
  let fixture: ComponentFixture<BoardMenuComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), provideRouter([])] });
    fixture = TestBed.createComponent(BoardMenuComponent);
    fixture.componentRef.setInput('cells', CELLS);
    fixture.componentRef.setInput('labels', LABELS);
    fixture.componentRef.setInput('isNight', true);
    fixture.componentRef.setInput('columnCount', 3);
    fixture.componentRef.setInput('rowCount', 2);
    fixture.componentRef.setInput('adminPath', '/admin');
    await fixture.whenStable();
    host = fixture.nativeElement as HTMLElement;
  });

  function regionButtons(): HTMLButtonElement[] {
    return Array.from(host.querySelectorAll<HTMLButtonElement>('.board-menu__region'));
  }

  it('places one region button per cell on the board grid', () => {
    const buttons = regionButtons();
    expect(buttons.map(button => button.querySelector('span')?.textContent?.trim())).toEqual([
      'About',
      'Home',
      'Projects',
    ]);
    expect(buttons[1].querySelector('.board-menu__here')?.textContent?.trim()).toBe('you are here');
    expect(buttons[2].parentElement?.style.gridRow).toBe('2');
  });

  it('marks only the current region', () => {
    const current = regionButtons().filter(button => button.getAttribute('aria-current') === 'page');
    expect(current.length).toBe(1);
    expect(current[0].textContent).toContain('Home');
  });

  it('emits the chosen region', () => {
    const selected: BoardRegion[] = [];
    fixture.componentInstance.regionSelected.subscribe(region => selected.push(region));
    regionButtons()[2].click();
    expect(selected).toEqual([BoardRegion.Projects]);
  });

  it('emits a theme toggle and names the action it will take', () => {
    let toggleCount = 0;
    fixture.componentInstance.themeToggled.subscribe(() => toggleCount++);
    const themeButton = host.querySelector<HTMLButtonElement>('.board-menu__theme');
    expect(themeButton?.getAttribute('aria-label')).toBe('Switch to day');
    themeButton?.click();
    expect(toggleCount).toBe(1);
  });

  it('links to the admin sign in', () => {
    const adminLink = host.querySelector<HTMLAnchorElement>('.board-menu__admin');
    expect(adminLink?.getAttribute('href')).toBe('/admin');
    expect(adminLink?.textContent?.trim()).toBe('admin sign in');
  });
});
