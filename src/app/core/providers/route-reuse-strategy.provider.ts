import { RouteReuseStrategy } from '@angular/router';

import { CustomRouteReuseStrategy } from '@core/services/route-reuse-strategy.service';

export const routeReuseStrategy = {
  provide: RouteReuseStrategy,
  useClass: CustomRouteReuseStrategy,
};
