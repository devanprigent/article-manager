import type { ArticleListFilters } from '../constants/types';

export const queryKeys = {
  articles: {
    all: ['articles'],
    list: (filters: ArticleListFilters = {}) => [...queryKeys.articles.all, 'list', filters],
    slice: (page: number, pageSize: number, filters: ArticleListFilters = {}) => [...queryKeys.articles.all, page, pageSize, filters],
    detail: (id: number) => [...queryKeys.articles.all, 'detail', id],
    search: (query: string, page: number, pageSize: number) => [...queryKeys.articles.all, 'search', query, page, pageSize],
  },
  tags: {
    all: ['tags'],
    list: () => [...queryKeys.tags.all, 'list'],
  },
  authors: {
    all: ['authors'],
    list: () => [...queryKeys.authors.all, 'list'],
    list_top: () => [...queryKeys.authors.all, 'list_top'],
  },
  auth: {
    all: ['auth'],
    session: () => [...queryKeys.auth.all, 'session'],
  },
  health: {
    all: ['health'],
    status: () => [...queryKeys.health.all, 'status'],
  },
} as const;
