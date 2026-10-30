import { useState } from 'react';
import { ExternalLink, Plus, Rss } from 'react-feather';

import { RemoveButton } from '../../core/components/RemoveButton';
import { LoadingIcon } from '../../core/ui/LoadingIcon';
import PageHeader from '../../core/ui/PageHeader';
import { useCreateRssFeed, useRemoveRssFeed } from '../../hooks/mutations';
import { useRssFeeds } from '../../hooks/queries';
import type { RssFeed } from '../../types/types';
import RssFeedForm from './RssFeedForm';

const EMPTY_MESSAGE = 'No RSS feeds yet. Add one to follow a website.';

function RssFeedRow({ feed }: Readonly<{ feed: RssFeed }>) {
  const { mutate: remove, isPending } = useRemoveRssFeed();

  return (
    <li
      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/80"
      data-testid={`rss-feed-${feed.id}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300">
          <Rss size={18} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <a
            href={feed.site_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-slate-900 no-underline hover:underline dark:text-slate-100"
          >
            {feed.site_name}
            <ExternalLink size={14} aria-hidden="true" />
          </a>
          <p className="m-0 truncate text-sm text-slate-500 dark:text-slate-400">{feed.site_rss_feed}</p>
        </div>
      </div>
      <RemoveButton itemId={feed.id} remove={remove} isPending={isPending} title={'Delete this feed?'} />
    </li>
  );
}

function RssPage() {
  const { data: feeds = [], error, isLoading } = useRssFeeds();
  const { mutate: create, isPending } = useCreateRssFeed();
  const [modalCreate, setModalCreate] = useState(false);

  function toggleModalCreate() {
    setModalCreate(!modalCreate);
  }

  let content;
  if (isLoading) {
    content = (
      <div className="flex justify-center p-6 text-slate-500">
        <LoadingIcon width={32} height={32} />
      </div>
    );
  } else if (error) {
    content = (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
        <p className="m-0 font-semibold">Unable to load RSS feeds.</p>
        <p className="m-0 mt-2 text-sm">{error.message}</p>
      </div>
    );
  } else if (feeds.length === 0) {
    content = <p className="m-0 p-6 text-center text-sm text-slate-500 dark:text-slate-400">{EMPTY_MESSAGE}</p>;
  } else {
    content = (
      <ul className="mx-auto flex max-w-3xl list-none flex-col gap-3 pb-2 pl-3 pr-6">
        {feeds.map((feed) => (
          <RssFeedRow key={feed.id} feed={feed} />
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="RSS" description="Include the RSS feeds you want to follow. Automatically download their articles to your inbox.">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
            {feeds.length} {feeds.length === 1 ? 'feed' : 'feeds'}
          </span>
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:opacity-90 dark:bg-emerald-900/40 dark:text-emerald-300"
            onClick={toggleModalCreate}
            disabled={isPending}
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </PageHeader>

      {content}

      {modalCreate && (
        <RssFeedForm
          isOpen={modalCreate}
          toggle={toggleModalCreate}
          isPending={isPending}
          onSave={(feed) => create(feed, { onSuccess: () => setModalCreate(false) })}
        />
      )}
    </div>
  );
}

export default RssPage;
