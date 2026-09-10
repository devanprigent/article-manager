import { Article } from '../../../types/types';

type ArticleBlockProps = {
  tag: string;
  text: string;
};

function splitListItems(text: string) {
  return text
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

function ArticleBlock({ tag, text }: Readonly<ArticleBlockProps>) {
  const normalizedTag = tag.toLowerCase();
  const className = 'whitespace-pre-wrap text-base leading-8 text-slate-700 dark:text-slate-200';

  switch (normalizedTag) {
    case 'h1':
      return <h1 className="mt-8 text-3xl font-bold leading-tight text-slate-950 first:mt-0 dark:text-slate-50">{text}</h1>;
    case 'h2':
      return <h2 className="mt-8 text-2xl font-bold leading-tight text-slate-950 first:mt-0 dark:text-slate-50">{text}</h2>;
    case 'h3':
      return <h3 className="mt-7 text-xl font-semibold leading-tight text-slate-900 first:mt-0 dark:text-slate-100">{text}</h3>;
    case 'h4':
      return <h4 className="mt-6 text-lg font-semibold leading-tight text-slate-900 first:mt-0 dark:text-slate-100">{text}</h4>;
    case 'blockquote':
      return (
        <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-slate-600 dark:border-indigo-500 dark:text-slate-300">{text}</blockquote>
      );
    case 'ul':
      return (
        <ul className="list-disc space-y-2 pl-6 text-base leading-8 text-slate-700 dark:text-slate-200">
          {splitListItems(text).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="list-decimal space-y-2 pl-6 text-base leading-8 text-slate-700 dark:text-slate-200">
          {splitListItems(text).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case 'li':
      return (
        <ul className="list-disc pl-6 text-base leading-8 text-slate-700 dark:text-slate-200">
          <li>{text}</li>
        </ul>
      );
    default:
      return <p className={className}>{text}</p>;
  }
}

export function ContentVisualizer({ article }: { article: Article }) {
  if (!article.content) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
        Article content not found.
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 sm:p-8">
      {article.content.length ? (
        <div className="space-y-5">
          {article.content.map((block, index) => (
            <ArticleBlock key={`${block.tag}-${index}`} tag={block.tag} text={block.text} />
          ))}
        </div>
      ) : (
        <p className="m-0 text-slate-600 dark:text-slate-300">No content available for this article.</p>
      )}
    </article>
  );
}
