export interface Item {
  id: number;
  nom: string;
}

export interface Article extends Item {
  tags: Tag[];
  auteur: string;
  url_site: string;
  url_article: string;
  date: number;
  summary: string;
  read: boolean;
  favoris: boolean;
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
