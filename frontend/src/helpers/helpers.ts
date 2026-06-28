import type { Article, Entity, ReadByMonthStat } from '../constants/types';

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

function isSameCalendarDay(firstDate: Date, secondDate: Date): boolean {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export function formatCreatedDate(dateCreation: string): string {
  const createdAt = new Date(dateCreation);

  if (Number.isNaN(createdAt.getTime())) {
    return dateCreation;
  }

  if (isSameCalendarDay(createdAt, new Date())) {
    return 'Today';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(createdAt);
}

const APP_PATHS_AFTER_LOGIN = ['/articles', '/likes', '/read-again', '/stats'] as const;

export function postLoginPath(state: unknown): string {
  const from = (state as { from?: string } | null)?.from;
  if (from && (APP_PATHS_AFTER_LOGIN as readonly string[]).includes(from)) {
    return from;
  }
  return '/articles';
}

export const getReadPerMonth = (articles: Article[]) => {
  const counts = new Map<string, ReadByMonthStat>();

  articles.forEach((article) => {
    if (!article.consulted) {
      return;
    }

    const sourceDate = article.date_modification || article.date_creation;
    const date = new Date(sourceDate);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    const existing = counts.get(monthKey);
    if (existing) {
      existing.count += 1;
      return;
    }

    counts.set(monthKey, { monthKey, monthLabel, count: 1 });
  });

  return Array.from(counts.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
};
