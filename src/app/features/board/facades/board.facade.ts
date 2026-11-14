import { DestroyRef, Service, Signal, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { AnalyticsEvent } from '../../../core/enums/core.enums';
import { AboutService } from '../../../core/services/data/about.service';
import { ExperienceService } from '../../../core/services/data/experience.service';
import { ProjectsService } from '../../../core/services/data/projects.service';
import { SkillsService } from '../../../core/services/data/skills.service';
import { AnalyticsService } from '../../../core/services/platform/analytics.service';
import { SeoService } from '../../../core/services/platform/seo.service';
import { ThemeService } from '../../../core/services/platform/theme.service';
import { BoardDirection, BoardPanelWidth, BoardRegion, BoardRouteParam } from '../enums/board.enums';
import {
  BoardArrowView,
  BoardCityPan,
  BoardMenuCell,
  BoardMenuLabels,
  BoardPanelView,
  BoardRegionConfig,
} from '../models/board.models';
import { BOARD_REGIONS, BOARD_ROOT_PATH } from '../utils/board.const';
import {
  buildCityPan,
  buildSurfaceTransform,
  countBoardColumns,
  countBoardRows,
  findNeighbour,
  findRegionConfig,
  resolveBoardRegion,
} from '../utils/board.utils';

@Service({ autoProvided: false })
export class BoardFacade {
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly seoService: SeoService = inject(SeoService);
  private readonly analyticsService: AnalyticsService = inject(AnalyticsService);

  readonly COLUMN_COUNT: number = countBoardColumns();
  readonly ROW_COUNT: number = countBoardRows();

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('BOARD') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  readonly activeRegion: Signal<BoardRegion> = toSignal(
    this.route.paramMap.pipe(
      map((params: ParamMap) => resolveBoardRegion(params.get(BoardRouteParam.Region)))
    ),
    { initialValue: resolveBoardRegion(this.route.snapshot.paramMap.get(BoardRouteParam.Region)) }
  );

  private readonly activeConfig: Signal<BoardRegionConfig> = computed(() =>
    findRegionConfig(this.activeRegion())
  );

  readonly surfaceTransform: Signal<string> = computed(() =>
    buildSurfaceTransform(this.activeConfig())
  );

  readonly cityPan: Signal<BoardCityPan> = computed(() => buildCityPan(this.activeConfig()));

  readonly isNight: Signal<boolean> = this.themeService.isDark;

  readonly activeHeading: Signal<string> = computed(
    () => this.translation()[this.activeConfig().labelKey] ?? ''
  );

  readonly panels: Signal<BoardPanelView[]> = computed(() => {
    const translation = this.translation();
    const activeRegion = this.activeRegion();
    return BOARD_REGIONS.map(config => ({
      region: config.region,
      gridColumn: config.column + 1,
      gridRow: config.row + 1,
      heading: translation[config.headingKey] ?? '',
      note: translation[config.noteKey] ?? '',
      isWide: config.width === BoardPanelWidth.Wide,
      isActive: config.region === activeRegion,
    }));
  });

  readonly menuCells: Signal<BoardMenuCell[]> = computed(() => {
    const translation = this.translation();
    const activeRegion = this.activeRegion();
    return BOARD_REGIONS.map(config => ({
      region: config.region,
      label: translation[config.labelKey] ?? '',
      gridColumn: config.column + 1,
      gridRow: config.row + 1,
      isActive: config.region === activeRegion,
    }));
  });

  readonly menuLabels: Signal<BoardMenuLabels> = computed(() => {
    const translation = this.translation();
    return {
      open: translation['MENU_OPEN'] ?? '',
      close: translation['MENU_CLOSE'] ?? '',
      heading: translation['MENU_HEADING'] ?? '',
      here: translation['MENU_HERE'] ?? '',
      day: translation['THEME_DAY'] ?? '',
      night: translation['THEME_NIGHT'] ?? '',
      themeAction: translation[this.isNight() ? 'THEME_TO_DAY' : 'THEME_TO_NIGHT'] ?? '',
    };
  });

  readonly arrows: Signal<BoardArrowView[]> = computed(() => {
    const translation = this.translation();
    const activeConfig = this.activeConfig();
    const arrows: BoardArrowView[] = [];
    for (const direction of Object.values(BoardDirection)) {
      const neighbour = findNeighbour(activeConfig, direction);
      if (neighbour) {
        const label = translation[neighbour.labelKey] ?? '';
        arrows.push({ direction, label, ariaLabel: `${translation['GO_TO'] ?? ''} ${label}`.trim() });
      }
    }
    return arrows;
  });

  constructor() {
    // The panels hydrate on idle, after the app is stable and the HTTP transfer cache is closed.
    // Creating the data resources here, during initial hydration, serves them from the
    // pre-rendered state, so panels never re-fetch or flash a loading state over rendered content.
    inject(AboutService);
    inject(ExperienceService);
    inject(SkillsService);
    inject(ProjectsService);

    effect(() => {
      this.seoService.applyPageTitle(this.activeHeading());
    });
    effect(() => {
      this.analyticsService.trackEvent(AnalyticsEvent.PageView, {
        page_path: `${BOARD_ROOT_PATH}${this.activeRegion()}`,
      });
    });
    inject(DestroyRef).onDestroy(() => this.seoService.resetTitle());
  }

  move(direction: BoardDirection): Promise<boolean> {
    const neighbour = findNeighbour(this.activeConfig(), direction);
    if (!neighbour) {
      return Promise.resolve(false);
    }
    return this.goTo(neighbour.region);
  }

  goTo(region: BoardRegion): Promise<boolean> {
    return this.router.navigate([BOARD_ROOT_PATH, region]);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
