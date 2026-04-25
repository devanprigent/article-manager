export interface Article {
  id: number;
  title: string;
  author: string;
  url: string;
  year: number;
  summary: string;
  read: boolean;
  read_again: boolean;
  favorite: boolean;
  tags: string[];
  date_creation: string;
  date_modification: string;
}

export interface Credentials {
  name: string;
  password: string;
}

export interface Token {
  access_token: string;
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

export interface FormProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (item: Article) => void;
  title: string;
  activeItem: Article;
  showDeleteButton?: boolean;
}
