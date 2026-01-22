import {ActivatedRouteSnapshot,DetachedRouteHandle,RouteReuseStrategy} from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedHandles = new Map<string, DetachedRouteHandle>();

  /** Decide which routes should be cached */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig?.path === 'home'; //  Only cache HomeComponent
  }

  /** Store the detached route */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle && route.routeConfig?.path) {
      this.storedHandles.set(route.routeConfig.path, handle);
    }
  }

  /** Decide if a route should be reattached from cache */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig?.path && this.storedHandles.has(route.routeConfig.path);
  }

  /** Retrieve the cached route instance */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig?.path) return null;
    return this.storedHandles.get(route.routeConfig.path) || null;
  }

  /** Always reuse the route if configs match */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
