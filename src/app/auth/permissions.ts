import type { AppModule, UserRole } from './types';

const ALL_MODULES: AppModule[] = [
  'dashboard',
  'alarmas',
  'data',
  'mantenimiento',
  'historico',
  'documentacion',
];

export const ROLE_PERMISSIONS: Record<UserRole, AppModule[]> = {
  superadmin: ALL_MODULES,
  administrador: ['dashboard', 'alarmas', 'data', 'mantenimiento', 'historico'],
  operador: ['dashboard', 'alarmas', 'data'],
  tecnico: ['dashboard', 'data', 'mantenimiento', 'historico'],
};

export function getModulesForRole(role: UserRole): AppModule[] {
  return ROLE_PERMISSIONS[role];
}

export function hasModuleAccess(role: UserRole, module: AppModule): boolean {
  return ROLE_PERMISSIONS[role].includes(module);
}

export function getDefaultRouteForRole(role: UserRole): string {
  const modules = ROLE_PERMISSIONS[role];
  const priority: AppModule[] = [
    'dashboard',
    'alarmas',
    'data',
    'mantenimiento',
    'historico',
    'documentacion',
  ];

  const firstModule = priority.find((module) => modules.includes(module));
  if (!firstModule) return '/';

  const routes: Record<AppModule, string> = {
    dashboard: '/',
    alarmas: '/alarmas',
    data: '/data',
    mantenimiento: '/mantenimiento',
    historico: '/historico',
    documentacion: '/documentacion',
  };

  return routes[firstModule];
}

export function getModuleFromPath(pathname: string): AppModule | null {
  const normalized = pathname.replace(/\/$/, '') || '/';

  if (normalized === '/') return 'dashboard';
  if (normalized.startsWith('/alarmas')) return 'alarmas';
  if (normalized.startsWith('/data')) return 'data';
  if (normalized.startsWith('/mantenimiento')) return 'mantenimiento';
  if (normalized.startsWith('/historico')) return 'historico';
  if (normalized.startsWith('/documentacion')) return 'documentacion';

  return null;
}
