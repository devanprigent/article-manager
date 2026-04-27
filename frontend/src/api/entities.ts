import axios from 'axios';
import { API_URLS } from '../constants/constants';
import type { Article, AuthorStat, Credentials, Token, AccessToken, Message } from '../constants/types';

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const { access_token } = await authApi.refresh();

    sessionStorage.setItem('access_token', access_token);
    originalRequest.headers.Authorization = `Bearer ${access_token}`;
    return apiClient(originalRequest);
  },
);

export const authApi = {
  register: async (credentials: Credentials): Promise<Token> => {
    const { data } = await apiClient.post(API_URLS.REGISTER, credentials);
    return data;
  },
  login: async (credentials: Credentials): Promise<Token> => {
    const { data } = await apiClient.post(API_URLS.LOGIN, credentials);
    return data;
  },
  refresh: async (): Promise<AccessToken> => {
    const refreshToken = sessionStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    const { data } = await axios.post(
      API_URLS.REFRESH,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );
    return data;
  },
  logout: async (): Promise<Message> => {
    const { data } = await apiClient.post(API_URLS.LOGOUT);
    return data;
  },
};

export const articlesApi = {
  list: async (): Promise<Article[]> => {
    const { data } = await apiClient.get(API_URLS.ARTICLES);
    return data;
  },
  create: async (article: Article): Promise<Article> => {
    const { data } = await apiClient.post(API_URLS.ARTICLES, article);
    return data;
  },
  update: async (article: Article): Promise<Article> => {
    const { data } = await apiClient.put(API_URLS.ARTICLES, article);
    return data;
  },
  remove: async (ids: number[]): Promise<void> => {
    await apiClient.delete(API_URLS.ARTICLES, {
      data: { ids },
    });
  },
};

export const authorsApi = {
  list: async (): Promise<string[]> => {
    const { data } = await apiClient.get(API_URLS.AUTHORS);
    return data;
  },
  list_top: async (): Promise<AuthorStat[]> => {
    const { data } = await apiClient.get(API_URLS.TOP_AUTHORS);
    return data;
  },
  create: async (author: string): Promise<string> => {
    const { data } = await apiClient.post(API_URLS.AUTHORS, author);
    return data;
  },
  update: async (author: string): Promise<string> => {
    const { data } = await apiClient.put(API_URLS.AUTHORS, author);
    return data;
  },
  remove: async (ids: number[]): Promise<void> => {
    await apiClient.delete(API_URLS.AUTHORS, {
      data: { ids },
    });
  },
};

export const tagsApi = {
  list: async (): Promise<string[]> => {
    const { data } = await apiClient.get(API_URLS.TAGS);
    return data;
  },
  create: async (tag: string): Promise<string> => {
    const { data } = await apiClient.post(API_URLS.TAGS, tag);
    return data;
  },
  update: async (tag: string): Promise<string> => {
    const { data } = await apiClient.put(API_URLS.TAGS, tag);
    return data;
  },
  remove: async (ids: number[]): Promise<void> => {
    await apiClient.delete(API_URLS.TAGS, {
      data: { ids },
    });
  },
};
