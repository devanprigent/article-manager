import axios from 'axios';
import { API_URLS } from '../constants/constants';
import type { Article, AuthorStat, Credentials, Token, Message } from '../constants/types';

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authApi = {
  register: async (credentials: Credentials): Promise<Token> => {
    const { data } = await apiClient.post(API_URLS.REGISTER, credentials);
    return data;
  },
  login: async (credentials: Credentials): Promise<Token> => {
    const { data } = await apiClient.post(API_URLS.LOGIN, credentials);
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
