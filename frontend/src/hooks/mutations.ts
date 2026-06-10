import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import { articlesApi, authApi, authorsApi, tagsApi } from '../api/entities';
import { queryKeys } from '../api/queryKeys';
import { Message } from '../constants/types';
import { useAuth } from '../contexts/AuthContext';

function stringifyErrorValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    const messages = value
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }
        if (item && typeof item === 'object' && 'msg' in item && typeof item.msg === 'string') {
          return item.msg;
        }
        return undefined;
      })
      .filter((message): message is string => Boolean(message));

    return messages.length > 0 ? messages.join(', ') : undefined;
  }

  return undefined;
}

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (data && typeof data === 'object') {
      const { message, error } = data;
      return stringifyErrorValue(message) ?? stringifyErrorValue(error) ?? err.message;
    }
    return stringifyErrorValue(data) ?? err.message;
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
export const useCreateTag = () => useEntitiesMutation(tagsApi.create, queryKeys.tags.all, 'Tag successfully added');

function useAuthMutation<TArgs>(mutationFn: (args: TArgs) => Promise<Message>) {
  const { login } = useAuth();
  return useMutation({
    mutationFn,
    onSuccess: () => login(),
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
}

export const useRegister = () => useAuthMutation(authApi.register);

export const useLogin = () => useAuthMutation(authApi.login);

export const useLogout = () => {
  const { logout } = useAuth();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
    },
    onError: () => {
      logout();
    },
  });
};

export const useParsing = () => {
  return useMutation({
    mutationFn: articlesApi.parse,
    onSuccess: () => {
      toast.success('Article successfully parsed!');
    },
    onError: (err: unknown) => {
      toast.error(extractErrorMessage(err));
    },
  });
};
