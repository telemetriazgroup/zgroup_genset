export type UserRole = 'superadmin' | 'administrador' | 'operador' | 'tecnico';

export type AppModule =
  | 'dashboard'
  | 'alarmas'
  | 'data'
  | 'mantenimiento'
  | 'historico'
  | 'documentacion';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export const MODULE_ROUTES: Record<AppModule, string> = {
  dashboard: '/',
  alarmas: '/alarmas',
  data: '/data',
  mantenimiento: '/mantenimiento',
  historico: '/historico',
  documentacion: '/documentacion',
};

export const MODULE_LABELS: Record<AppModule, string> = {
  dashboard: 'Panel Principal',
  alarmas: 'Alarmas',
  data: 'Data',
  mantenimiento: 'Mantenimiento',
  historico: 'Histórico',
  documentacion: 'Documentación',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: 'Super Administrador',
  administrador: 'Administrador',
  operador: 'Operador',
  tecnico: 'Técnico',
};
