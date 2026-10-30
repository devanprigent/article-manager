import { CSSProperties, ReactNode } from 'react';

type ArticleLinkProps = {
  id: number;
  url: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ArticleLink({ id, url, children, className, style }: Readonly<ArticleLinkProps>) {
  return (
    <a data-testid={`article-link-${id}`} href={url} className={className} style={style} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
