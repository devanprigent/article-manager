import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '../layout/PageHeader';
import { useArticles, useIsDarkMode } from '../../redux/selectors';
import StatsGraphWidget from '../features/StatsGraphWidget';

type AuthorStat = {
  author: string;
  count: number;
};

type ReadByMonthStat = {
  monthKey: string;
  monthLabel: string;
  count: number;
};

function StatsPage() {
  const articles = useArticles();
  const isDarkMode = useIsDarkMode();
  const axisColor = isDarkMode ? '#cbd5e1' : '#475569';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
    borderRadius: '0.75rem',
    color: isDarkMode ? '#e2e8f0' : '#0f172a',
  };

  const topAuthors = useMemo<AuthorStat[]>(() => {
    const counts = new Map<string, number>();

    articles.forEach((article) => {
      const author = article.author?.trim() || 'Unknown';
      counts.set(author, (counts.get(author) || 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [articles]);

  const readPerMonth = useMemo<ReadByMonthStat[]>(() => {
    const counts = new Map<string, ReadByMonthStat>();

    articles.forEach((article) => {
      if (!article.read) {
        return;
      }

      const sourceDate = article.date_modification || article.date_creation;
      const date = new Date(sourceDate);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      const existing = counts.get(monthKey);
      if (existing) {
        existing.count += 1;
        return;
      }

      counts.set(monthKey, { monthKey, monthLabel, count: 1 });
    });

    return Array.from(counts.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [articles]);

  const readCount = articles.filter((article) => article.read).length;

  return (
    <div className="space-y-5">
      <PageHeader title="Stats" description="Understand reading trends across your article collection.">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">{articles.length} total</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            {readCount} read
          </span>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {topAuthors.length} top author entries
          </span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <StatsGraphWidget
          title="Top Authors"
          description="Most frequently registered authors in your library."
          emptyMessage="Add articles with author names to display this chart."
          hasData={topAuthors.length > 0}
          isDarkMode={isDarkMode}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topAuthors} margin={{ top: 8, right: 12, left: 0, bottom: 20 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="author" tick={false} />
              <YAxis allowDecimals={false} tick={{ fill: axisColor }} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: axisColor }} />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </StatsGraphWidget>

        <StatsGraphWidget
          title="Articles Read by Month"
          description="Monthly trend of articles marked as read."
          emptyMessage="Mark articles as read to display monthly activity."
          hasData={readPerMonth.length > 0}
          isDarkMode={isDarkMode}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readPerMonth} margin={{ top: 8, right: 12, left: 0, bottom: 20 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="monthLabel" tick={{ fill: axisColor }} />
              <YAxis allowDecimals={false} tick={{ fill: axisColor }} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: axisColor }} />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </StatsGraphWidget>
      </div>
    </div>
  );
}

export default StatsPage;
