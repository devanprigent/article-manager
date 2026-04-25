import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { articlesApi, authorsApi, tagsApi, authApi } from '../api/entities';
import { queryKeys } from '../api/queryKeys';
import { Token, Message } from '../constants/types';
import { useAuth } from '../contexts/AuthContext';

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Unknown error';
}

function useEntitiesMutation<TArgs, TResult>(mutationFn: (args: TArgs) => Promise<TResult>, queryKey: readonly string[], successMessage: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success(successMessage);
    },
    onError: (err: unknown) => {
      toast.error(extractErrorMessage(err));
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

function useAuthMutation<TArgs>(mutationFn: (args: TArgs) => Promise<Token>, successMessage: string) {
  const { login } = useAuth();
  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      login(res.access_token);
      toast.success(successMessage);
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
}

export const useRegister = () => useAuthMutation(authApi.register, 'Successfully registered');

export const useLogin = () => useAuthMutation(authApi.login, 'Successfully logged in');

export const useLogout = () => {
  const qc = useQueryClient();
  const { logout } = useAuth();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: (res: Message) => {
      logout();
      qc.clear();
      toast.success(res.msg);
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
};
