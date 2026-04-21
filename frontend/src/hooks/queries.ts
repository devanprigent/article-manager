import { useQuery } from '@tanstack/react-query';
import { articlesApi, authorsApi, tagsApi } from '../api/entities';
import { queryKeys } from '../api/queryKeys';

export function useArticles() {
  return useQuery({
    queryKey: queryKeys.articles.list(),
    queryFn: articlesApi.list,
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
