import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Signal,
  afterNextRender,
  inject,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardArrowsComponent } from './components/board-arrows/board-arrows.component';
import { BoardMenuComponent } from './components/board-menu/board-menu.component';
import { BoardPanelComponent } from './components/board-panel/board-panel.component';
import { CityBackdropComponent } from './components/city-backdrop/city-backdrop.component';
import { AboutPanelComponent } from './components/panels/about-panel/about-panel.component';
import { ContactPanelComponent } from './components/panels/contact-panel/contact-panel.component';
import { ExperiencePanelComponent } from './components/panels/experience-panel/experience-panel.component';
import { HeroPanelComponent } from './components/panels/hero-panel/hero-panel.component';
import { ProjectsPanelComponent } from './components/panels/projects-panel/projects-panel.component';
import { SkillsPanelComponent } from './components/panels/skills-panel/skills-panel.component';
import { BoardDirection, BoardRegion } from './enums/board.enums';
import { BoardFacade } from './facades/board.facade';
import {
  BoardArrowView,
  BoardCityPan,
  BoardMenuCell,
  BoardMenuLabels,
  BoardPanelView,
  BoardTouchPoint,
} from './models/board.models';
import {
  BOARD_ADMIN_PATH,
  BOARD_CLASSIC_PATH,
  BOARD_SHOWS_CLASSIC_LINK,
  BOARD_WHEEL_GESTURE_GAP_MS,
  BOARD_WHEEL_LOCK_MS,
  BOARD_WHEEL_QUIET_MS,
  WHEEL_LINE_HEIGHT,
} from './utils/board.const';
import {
  directionForKey,
  isTypingTarget,
  isVerticalDirection,
  swipeDirection,
  wheelDirection,
} from './utils/board.utils';

@Component({
  selector: 'app-board',
  imports: [
    RouterLink,
    BoardArrowsComponent,
    BoardMenuComponent,
    BoardPanelComponent,
    CityBackdropComponent,
    HeroPanelComponent,
    AboutPanelComponent,
    ExperiencePanelComponent,
    SkillsPanelComponent,
    ProjectsPanelComponent,
    ContactPanelComponent,
  ],
  providers: [BoardFacade],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class BoardComponent {
  private readonly boardFacade: BoardFacade = inject(BoardFacade);
  private readonly injector: Injector = inject(Injector);

  protected readonly CLASSIC_PATH: string = BOARD_CLASSIC_PATH;
  protected readonly SHOWS_CLASSIC_LINK: boolean = BOARD_SHOWS_CLASSIC_LINK;
  protected readonly ADMIN_PATH: string = BOARD_ADMIN_PATH;
  protected readonly REGION: typeof BoardRegion = BoardRegion;
  protected readonly COLUMN_COUNT: number = this.boardFacade.COLUMN_COUNT;
  protected readonly ROW_COUNT: number = this.boardFacade.ROW_COUNT;

  protected readonly translation: Signal<Record<string, string>> = this.boardFacade.translation;
  protected readonly panels: Signal<BoardPanelView[]> = this.boardFacade.panels;
  protected readonly arrows: Signal<BoardArrowView[]> = this.boardFacade.arrows;
  protected readonly surfaceTransform: Signal<string> = this.boardFacade.surfaceTransform;
  protected readonly activeHeading: Signal<string> = this.boardFacade.activeHeading;
  protected readonly cityPan: Signal<BoardCityPan> = this.boardFacade.cityPan;
  protected readonly isNight: Signal<boolean> = this.boardFacade.isNight;

  protected readonly menuCells: Signal<BoardMenuCell[]> = this.boardFacade.menuCells;
  protected readonly menuLabels: Signal<BoardMenuLabels> = this.boardFacade.menuLabels;

  private readonly panelComponents: Signal<readonly BoardPanelComponent[]> =
    viewChildren(BoardPanelComponent);
  private readonly menu: Signal<BoardMenuComponent> = viewChild.required(BoardMenuComponent);

  private touchStart: BoardTouchPoint | undefined;
  private touchStartScroll: number = 0;
  private wheelDeltaX: number = 0;
  private wheelDeltaY: number = 0;
  private lastWheelTime: number = 0;
  private wheelLockedUntil: number = 0;

  protected onMove(direction: BoardDirection): void {
    this.focusAfter(this.boardFacade.move(direction));
  }

  protected onRegionRequested(region: BoardRegion): void {
    this.focusAfter(this.boardFacade.goTo(region));
  }

  protected onMenuOpen(): void {
    this.menu().open();
  }

  protected onThemeToggled(): void {
    this.boardFacade.toggleTheme();
  }

  protected onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    if (event.touches.length !== 1 || !touch || isTypingTarget(event.target)) {
      this.touchStart = undefined;
      return;
    }
    this.touchStart = { x: touch.clientX, y: touch.clientY, time: event.timeStamp };
    this.touchStartScroll = this.activePanel()?.scrollOffset() ?? 0;
  }

  // A vertical swipe that scrolled a tall pane was reading, not navigating.
  protected onTouchEnd(event: TouchEvent): void {
    const start = this.touchStart;
    const touch = event.changedTouches[0];
    this.touchStart = undefined;
    if (!start || !touch) {
      return;
    }
    const direction = swipeDirection(start, { x: touch.clientX, y: touch.clientY, time: event.timeStamp });
    if (!direction) {
      return;
    }
    const hasScrolled = (this.activePanel()?.scrollOffset() ?? 0) !== this.touchStartScroll;
    if (isVerticalDirection(direction) && hasScrolled) {
      return;
    }
    this.onMove(direction);
  }

  // The wheel scrolls a tall pane first; only once the pane has no room left does it move the board,
  // and a pane that just finished scrolling must go quiet before the same flick can move on.
  protected onWheel(event: WheelEvent): void {
    if (event.ctrlKey) {
      return;
    }
    const now = event.timeStamp;
    if (now < this.wheelLockedUntil) {
      this.wheelLockedUntil = Math.max(this.wheelLockedUntil, now + BOARD_WHEEL_QUIET_MS);
      return;
    }
    if (now - this.lastWheelTime > BOARD_WHEEL_GESTURE_GAP_MS) {
      this.wheelDeltaX = 0;
      this.wheelDeltaY = 0;
    }
    this.lastWheelTime = now;
    const scale = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? WHEEL_LINE_HEIGHT : 1;
    this.wheelDeltaX += event.deltaX * scale;
    this.wheelDeltaY += event.deltaY * scale;
    const direction = wheelDirection(this.wheelDeltaX, this.wheelDeltaY);
    if (!direction) {
      return;
    }
    this.wheelDeltaX = 0;
    this.wheelDeltaY = 0;
    if (this.activePanel()?.canScroll(direction)) {
      this.wheelLockedUntil = now + BOARD_WHEEL_QUIET_MS;
      return;
    }
    this.wheelLockedUntil = now + BOARD_WHEEL_LOCK_MS;
    this.onMove(direction);
  }

  private activePanel(): BoardPanelComponent | undefined {
    return this.panelComponents().find(panel => panel.isActive());
  }

  private focusAfter(navigation: Promise<boolean>): void {
    void navigation.then(hasMoved => {
      if (hasMoved) {
        this.focusActivePanel();
      }
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) {
      return;
    }
    const direction = directionForKey(event.key);
    if (!direction) {
      return;
    }
    event.preventDefault();
    this.onMove(direction);
  }

  // The newly active panel stays inert until the next render, and inert elements cannot take focus.
  private focusActivePanel(): void {
    afterNextRender(
      () => {
        this.activePanel()?.focusHeading();
      },
      { injector: this.injector }
    );
  }
}
