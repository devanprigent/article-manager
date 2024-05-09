import { severityTypes } from "./Constants";

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
  tags: Tag[];
  date_creation: string;
  date_modification: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface FormProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (item: Article) => void;
  title: string;
  activeItem: Article;
  showDeleteButton?: boolean;
}

export type Severity = (typeof severityTypes)[keyof typeof severityTypes];

export type Notification = {
  timestamp?: number;
  open: boolean;
  message: string;
  severity: Severity;
};

export type ProxyResponse = {
  error: boolean;
  message: string;
  data: any;
};
