interface PropsType {
  title: string;
  author: string;
  year: number;
  url: string;
}

function Card({ title, author, year, url }: Readonly<PropsType>) {
  return (
    <div className="group h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex h-full flex-col justify-between gap-4">
        <h1 className="text-base font-semibold leading-snug text-slate-800">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h1>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <span className="max-w-[70%] truncate text-sm font-medium text-slate-600">
            {author}
          </span>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            {year}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
