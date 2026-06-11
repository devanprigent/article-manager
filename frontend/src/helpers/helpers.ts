import type { Entity } from '../constants/types';

export function getCookie(name: string): string | undefined {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return undefined;
}

export function normalizeEntityNames(entities: Array<string | Entity>): string[] {
  return entities.map((entity) => (typeof entity === 'string' ? entity : entity.name));
}

export function parseYear(date: string): number {
  if (!date) {
    return new Date().getFullYear();
  }

  return new Date(date).getFullYear();
}

const APP_PATHS_AFTER_LOGIN = ['/articles', '/likes', '/read-again', '/stats'] as const;

export function postLoginPath(state: unknown): string {
  const from = (state as { from?: string } | null)?.from;
  if (from && (APP_PATHS_AFTER_LOGIN as readonly string[]).includes(from)) {
    return from;
  }
  return '/articles';
}
