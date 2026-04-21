const baseURL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5000';

export const API_URLS = {
  ARTICLES: `${baseURL}/articles`,
  AUTHORS: `${baseURL}/authors`,
  TAGS: `${baseURL}/tags`,
};

export const buttonStyle = {
  error: 'focus:outline-none text-white bg-red-500 hover:bg-red-700 rounded-lg',
  warning: 'focus:outline-none text-black bg-yellow-400 hover:bg-yellow-600 rounded-lg',
  neutral: 'focus:outline-none text-black bg-gray-200 hover:bg-gray-400 rounded p-2',
  success: 'focus:outline-none text-white bg-green-500 hover:bg-green-700 rounded-lg',
};

export const buttonSize = {
  small: 'w-24 h-12 text-sm',
  medium: 'w-32 h-16 text-md',
  large: 'w-40 h-20 text-lg',
};

export const pageStyle = {
  bgColor: 'bg-gray-100',
};

export const severityTypes = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
};

export const severityColors = {
  [severityTypes.ERROR]: '#FE5531', // Soft red
  [severityTypes.WARNING]: '#FEAD28', // Soft orange
  [severityTypes.INFO]: '#31AAFE', // Soft blue
  [severityTypes.SUCCESS]: '#6FCC62', // Soft green
};
