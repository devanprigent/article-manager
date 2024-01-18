

export interface Article {
    id: number;
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

export interface WebSite {
    nom: string;
    url: string;
    image_url: string;
}

export interface FormProps {
    isOpen: boolean;
    toggle: () => void;
    onSave: (item: Article) => void;
    title: string;
    activeItem: Article;
}
