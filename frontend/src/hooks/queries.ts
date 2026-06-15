import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { articlesApi, authApi, authorsApi, healthApi, tagsApi } from '../api/entities';
import { queryKeys } from '../api/queryKeys';

export function useArticles(isSearching?: boolean, page?: number, pageSize?: number) {
  return useQuery({
    queryKey: page != undefined && pageSize != undefined ? queryKeys.articles.slice(page, pageSize) : queryKeys.articles.list(),
    queryFn: async () => {
      let offset;
      if (page != undefined && pageSize != undefined) {
        offset = page * pageSize;
      }
      const limit = pageSize;
      return articlesApi.list(offset, limit);
    },
    placeholderData: keepPreviousData,
    enabled: !isSearching,
  });
}

export function useSearch(query: string, page: number, pageSize: number) {
  return useQuery({
    queryKey: queryKeys.articles.search(query, page, pageSize),
    queryFn: async () => {
      const offset = page * pageSize;
      const limit = pageSize;
      return articlesApi.search(query, offset, limit);
    },
    enabled: query.length > 0 && page != undefined && pageSize != undefined,
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: queryKeys.articles.detail(id),
    queryFn: () => articlesApi.get(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useTopAuthors() {
  return useQuery({
    queryKey: queryKeys.authors.list_top(),
    queryFn: authorsApi.list_top,
  });
}

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: tagsApi.list,
  });
}

export function useAuthors() {
  return useQuery({
    queryKey: queryKeys.authors.list(),
    queryFn: authorsApi.list,
  });
}

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health.status(),
    queryFn: healthApi.status,
    refetchInterval: 60000,
    staleTime: 60000,
  });
}

export function useSession() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: authApi.session,
    retry: false,
  });
}
