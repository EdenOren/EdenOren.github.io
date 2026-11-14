import { RenderMode, ServerRoute } from '@angular/ssr';
import { AppRoute } from './core/enums/core.enums';
import { BoardRegion, BoardRouteParam } from './features/board/enums/board.enums';

export const serverRoutes: ServerRoute[] = [
  {
    path: `${AppRoute.Admin}/**`,
    renderMode: RenderMode.Client,
  },
  {
    path: AppRoute.Admin,
    renderMode: RenderMode.Client,
  },
  {
    path: `${AppRoute.LegacyBoard}/**`,
    renderMode: RenderMode.Client,
  },
  {
    path: AppRoute.Classic,
    renderMode: RenderMode.Prerender,
  },
  {
    path: `:${BoardRouteParam.Region}`,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async (): Promise<Record<string, string>[]> =>
      Object.values(BoardRegion).map((region: BoardRegion) => ({ [BoardRouteParam.Region]: region })),
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
