export interface Item {
  id: number;
  name: string;
}

export interface Article extends Item {
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

export interface WebSite extends Item {
  url: string;
  image_url: string;
}

export interface Tag extends Item {}

export interface FormProps<T extends Item> {
  isOpen: boolean;
  toggle: () => void;
  onSave: (item: T) => void;
  title: string;
  activeItem: T;
}
