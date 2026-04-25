export const queryKeys = {
  articles: {
    all: ['articles'],
    list: () => [...queryKeys.articles.all, 'list'],
    detail: (id: number) => [...queryKeys.articles.all, 'detail', id],
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
  },
} as const;
