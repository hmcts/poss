import { ROUTES, toggleTheme, getThemeClass } from '../app-shell/index.ts';

// -- Route Active -------------------------------------------------------------

export function isRouteActive(routePath: string, currentPath: string): boolean {
  return currentPath === routePath || currentPath.startsWith(routePath + '/');
}

// -- Navigation Items ---------------------------------------------------------

export function getNavigationItems() {
  return ROUTES.map((route) => ({
    path: route.path,
    label: route.label,
    icon: route.icon,
    isActive: (currentPath: string) => isRouteActive(route.path, currentPath),
  }));
}

// -- Theme Toggle State -------------------------------------------------------

export function getThemeToggleState(currentTheme: string) {
  return {
    currentTheme,
    nextTheme: toggleTheme(currentTheme),
    cssClass: getThemeClass(currentTheme),
    icon: currentTheme === 'dark' ? 'sun' : 'moon',
  };
}

// -- Layout Config ------------------------------------------------------------

export function getLayoutConfig() {
  return {
    sidebarWidth: 256,
    headerHeight: 64,
    breakpoint: 768,
  };
}
