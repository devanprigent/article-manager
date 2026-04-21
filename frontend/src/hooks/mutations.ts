import { useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi, authorsApi, tagsApi } from '../api/entities';
import { queryKeys } from '../api/queryKeys';
import { useDispatch } from 'react-redux';
import { SET_NOTIFICATION } from '../redux/actionsCreators';

function useEntitiesMutation<TArgs, TResult>(mutationFn: (args: TArgs) => Promise<TResult>, queryKey: readonly string[], successMessage: string) {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      dispatch(SET_NOTIFICATION(successMessage, 'success'));
    },
    onError: (err: Error) => {
      dispatch(SET_NOTIFICATION(err.message, 'error'));
    },
  });
}

export const useCreateArticle = () => useEntitiesMutation(articlesApi.create, queryKeys.articles.all, 'Article successfully added');
export const useEditArticle = () => useEntitiesMutation(articlesApi.update, queryKeys.articles.all, 'Article successfully edited');
export const useRemoveArticle = () => useEntitiesMutation(articlesApi.remove, queryKeys.articles.all, 'Article successfully deleted');

export const useCreateAuthor = () => useEntitiesMutation(authorsApi.create, queryKeys.authors.all, 'Author successfully added');
export const useEditAuthor = () => useEntitiesMutation(authorsApi.update, queryKeys.authors.all, 'Author successfully edited');
export const useRemoveAuthor = () => useEntitiesMutation(authorsApi.remove, queryKeys.authors.all, 'Author successfully deleted');

export const useCreateTag = () => useEntitiesMutation(tagsApi.create, queryKeys.tags.all, 'Tag successfully added');
export const useEditTag = () => useEntitiesMutation(tagsApi.update, queryKeys.tags.all, 'Tag successfully edited');
export const useRemoveTag = () => useEntitiesMutation(tagsApi.remove, queryKeys.tags.all, 'Tag successfully deleted');
