import axios from 'axios';
import { API_URLS } from '../constants/constants';
import type { Article, Entity } from '../constants/types';

export const articlesApi = {
  list: async (): Promise<Article[]> => {
    const { data } = await axios.get(API_URLS.ARTICLES);
    return data;
  },
  create: async (article: Article): Promise<Article> => {
    const { data } = await axios.post(API_URLS.ARTICLES, article);
    return data;
  },
  update: async (article: Article): Promise<Article> => {
    const { data } = await axios.put(`${API_URLS.ARTICLES}${article.id}/`, article);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await axios.delete(`${API_URLS.ARTICLES}${id}/`);
  },
};

export const authorsApi = {
  list: async (): Promise<Entity[]> => {
    const { data } = await axios.get(API_URLS.AUTHORS);
    return data;
  },
  create: async (author: Entity): Promise<Entity> => {
    const { data } = await axios.post(API_URLS.AUTHORS, author);
    return data;
  },
  update: async (author: Entity): Promise<Entity> => {
    const { data } = await axios.put(`${API_URLS.AUTHORS}${author.id}/`, author);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await axios.delete(`${API_URLS.AUTHORS}${id}/`);
  },
};

export const tagsApi = {
  list: async (): Promise<Entity[]> => {
    const { data } = await axios.get(API_URLS.TAGS);
    return data;
  },
  create: async (tag: Entity): Promise<Entity> => {
    const { data } = await axios.post(API_URLS.TAGS, tag);
    return data;
  },
  update: async (tag: Entity): Promise<Entity> => {
    const { data } = await axios.put(`${API_URLS.TAGS}${tag.id}/`, tag);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await axios.delete(`${API_URLS.TAGS}${id}/`);
  },
};
