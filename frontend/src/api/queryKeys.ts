export const queryKeys = {
  articles: {
    all: ['articles'],
    list: () => [...queryKeys.articles.all, 'list'],
    slice: (page: number, pageSize: number) => [...queryKeys.articles.all, page, pageSize],
    detail: (id: number) => [...queryKeys.articles.all, 'detail', id],
    search: (query: string) => [...queryKeys.articles.all, 'search', query],
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
