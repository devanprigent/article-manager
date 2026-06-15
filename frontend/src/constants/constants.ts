const baseURL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

export const API_URLS = {
  ARTICLES: `${baseURL}/articles`,
  PARSE: `${baseURL}/articles/metadata`,
  SEARCH: `${baseURL}/search`,
  AUTHORS: `${baseURL}/authors`,
  TOP_AUTHORS: `${baseURL}/authors/top`,
  TAGS: `${baseURL}/tags`,
  LOGIN: `${baseURL}/auth/login`,
  LOGOUT: `${baseURL}/auth/logout`,
  REGISTER: `${baseURL}/auth/register`,
  REFRESH: `${baseURL}/auth/refresh`,
  SESSION: `${baseURL}/auth/session`,
  HEALTH: `${baseURL}/health`,
};

export const buttonStyle = {
  error:
    'focus:outline-none text-white bg-red-500 hover:bg-red-700 rounded-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-500',
  warning:
    'focus:outline-none text-black bg-yellow-400 hover:bg-yellow-600 rounded-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-400',
  neutral:
    'focus:outline-none rounded-lg border border-slate-300 bg-slate-100 p-2 font-semibold tracking-wide text-slate-900 hover:bg-slate-200 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-300 disabled:hover:bg-slate-100 dark:border-slate-400 dark:bg-slate-500 dark:text-white dark:hover:border-slate-300 dark:hover:bg-slate-700 dark:disabled:hover:border-slate-400 dark:disabled:hover:bg-slate-500',
  success:
    'focus:outline-none rounded-lg border border-emerald-500/80 bg-emerald-100 p-2 font-semibold tracking-wide text-emerald-900 hover:border-emerald-600 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-emerald-500/80 disabled:hover:bg-emerald-100 dark:border-emerald-500 dark:bg-emerald-600/55 dark:text-emerald-50 dark:hover:border-emerald-400 dark:hover:bg-emerald-800/70 dark:disabled:hover:border-emerald-500 dark:disabled:hover:bg-emerald-600/55',
};

export const buttonSize = {
  small: 'w-24 h-12 text-sm',
  medium: 'w-32 h-16 text-md',
  large: 'w-40 h-20 text-lg',
};

export const pageSize = 25;
