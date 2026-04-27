const baseURL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5000';

export const API_URLS = {
  ARTICLES: `${baseURL}/articles`,
  AUTHORS: `${baseURL}/authors`,
  TOP_AUTHORS: `${baseURL}/authors/top`,
  TAGS: `${baseURL}/tags`,
  LOGIN: `${baseURL}/auth/login`,
  LOGOUT: `${baseURL}/auth/logout`,
  REGISTER: `${baseURL}/auth/register`,
  REFRESH: `${baseURL}/auth/refresh`,
};

export const buttonStyle = {
  error: 'focus:outline-none text-white bg-red-500 hover:bg-red-700 rounded-lg',
  warning: 'focus:outline-none text-black bg-yellow-400 hover:bg-yellow-600 rounded-lg',
  neutral:
    'focus:outline-none rounded-lg border border-slate-300 bg-slate-100 p-2 font-semibold tracking-wide text-slate-900 hover:bg-slate-200 hover:border-slate-400 dark:border-slate-400 dark:bg-slate-500 dark:text-white dark:hover:border-slate-300 dark:hover:bg-slate-700',
  success:
    'focus:outline-none rounded-lg border border-emerald-500/80 bg-emerald-100 p-2 font-semibold tracking-wide text-emerald-900 hover:border-emerald-600 hover:bg-emerald-200 dark:border-emerald-500 dark:bg-emerald-600/55 dark:text-emerald-50 dark:hover:border-emerald-400 dark:hover:bg-emerald-800/70',
};

export const buttonSize = {
  small: 'w-24 h-12 text-sm',
  medium: 'w-32 h-16 text-md',
  large: 'w-40 h-20 text-lg',
};

export const pageStyle = {
  bgColor: 'bg-gray-100',
};
