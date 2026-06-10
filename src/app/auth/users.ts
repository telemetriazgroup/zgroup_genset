import type { User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr-superadmin',
    email: 'ztrack@zgroup.com.pe',
    password: 'Ztrack2026!',
    name: 'ZTRACK Super Admin',
    role: 'superadmin',
  },
  {
    id: 'usr-admin',
    email: 'admin@zgroup.com.pe',
    password: 'Admin2026!',
    name: 'Carlos Mendoza',
    role: 'administrador',
  },
  {
    id: 'usr-operador',
    email: 'operador@zgroup.com.pe',
    password: 'Operador2026!',
    name: 'María López',
    role: 'operador',
  },
  {
    id: 'usr-tecnico',
    email: 'tecnico@zgroup.com.pe',
    password: 'Tecnico2026!',
    name: 'Juan Pérez',
    role: 'tecnico',
  },
];

export function authenticateUser(email: string, password: string): User | null {
  const normalizedEmail = email.trim().toLowerCase();
  const user = MOCK_USERS.find(
    (candidate) =>
      candidate.email.toLowerCase() === normalizedEmail &&
      candidate.password === password,
  );

  return user ?? null;
}
