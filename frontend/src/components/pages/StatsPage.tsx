import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useIsDarkMode } from '../../contexts/ThemeContext';
import { getReadPerMonth } from '../../helpers/helpers';
import { useArticles, useTopAuthors } from '../../hooks/queries';
import StatsGraphWidget from '../features/StatsGraphWidget';
import PageHeader from '../layout/PageHeader';

function StatsPage() {
  const { data: { articles = [] } = {}, isLoading: isArticlesLoading } = useArticles();
  const { data: topAuthors = [], isLoading: isAuthorsLoading } = useTopAuthors();
  const isLoading = isArticlesLoading || isAuthorsLoading;
  const isDarkMode = useIsDarkMode();
  const axisColor = isDarkMode ? '#cbd5e1' : '#475569';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
    borderRadius: '0.75rem',
    color: isDarkMode ? '#e2e8f0' : '#0f172a',
  };
  const readPerMonth = getReadPerMonth(articles);
  const consultedCount = articles.filter((article) => article.consulted).length;

  return (
    <div className="space-y-5">
      <PageHeader title="Stats" description="Understand reading trends across your article collection.">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">{articles.length} total</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            {consultedCount} consulted
          </span>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {topAuthors.length} authors
          </span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <StatsGraphWidget
          title="Top Authors"
          description="Most frequently registered authors in your library."
          emptyMessage="Add articles with author names to display this chart."
          hasData={topAuthors.length > 0}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
        >
          <ResponsiveContainer width="100%" height={320} minWidth={280}>
            <BarChart data={topAuthors.slice(0, 10)} margin={{ top: 8, right: 12, left: 0, bottom: 20 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="author" tick={false} />
              <YAxis allowDecimals={false} tick={{ fill: axisColor }} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: axisColor }} />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </StatsGraphWidget>

        <StatsGraphWidget
          title="Articles consulted by month"
          description="Monthly trend of articles marked as consulted."
          emptyMessage="Mark articles as consulted to display monthly activity."
          hasData={readPerMonth.length > 0}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
        >
          <ResponsiveContainer width="100%" height={320} minWidth={280}>
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
