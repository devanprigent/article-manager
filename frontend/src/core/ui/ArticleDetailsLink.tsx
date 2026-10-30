import { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ArticleLinkProps = {
  id: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ArticleDetailsLink({ id, children, className, style }: Readonly<ArticleLinkProps>) {
  return (
    <Link data-testid={`article-details-link-${id}`} to={`/library/${id}`} className={className} style={style}>
      {children}
    </Link>
  );
}
