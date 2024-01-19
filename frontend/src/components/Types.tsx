export interface Item {
    id?: number;
}

export interface Article extends Item {
    tags: string[];
    titre: string;
    auteur: string;
    url_site: string;
    url_article: string;
    date: number;
    synopsis: string;
    date_creation: string;
    date_modification: string;
}

export interface WebSite extends Item {
    nom: string;
    url: string;
    image_url: string;
}

export interface Tag extends Item {
    nom: string;
}

export interface FormProps<T extends Item> {
    isOpen: boolean;
    toggle: () => void;
    onSave: (item: T) => void;
    title: string;
    activeItem: T;
}
