export interface Article {
  id: number;
  title: string;
  author: string;
  url: string;
  year: number;
  summary: string;
  consulted: boolean;
  read_later: boolean;
  liked: boolean;
  tags: string[];
  date_creation: string;
  date_modification: string;
  content?: TagStructure[] | null;
}

export interface ParsedMetadata {
  title: string;
  author: string;
  date: string;
  url: string;
}

interface TagStructure {
  tag: string;
  text: string;
}

export interface Credentials {
  name: string;
  password: string;
}

export interface Message {
  msg: string;
}

export interface Entity {
  id: number;
  name: string;
}

export type AuthorStat = {
  author: string;
  count: number;
};

export interface BaseFormProps {
  isOpen: boolean;
  toggle: () => void;
  title: string;
  showDeleteButton?: boolean;
}

export interface ArticleFormProps extends BaseFormProps {
  onSave: (item: Article) => void;
  activeItem: Article;
  isPending?: boolean;
}

export interface UrlFormProps extends BaseFormProps {
  onSave: (url: string) => void;
}

export type GridPageCardAction = 'liked' | 'readLater';

export interface User {
  id: number;
  name: string;
}

export type AuthMode = 'login' | 'register';
