import { Heart } from 'react-feather';

import { GridColDef } from '@mui/x-data-grid';

import { ArticleLink } from '../features/ArticleLink';
import EditButton from '../features/EditButton';
import StatusIcon from '../features/StatusIcon';

export function getColumnVisibilityModel(isMdUp: boolean) {
  return {
    year: isMdUp,
    date_creation: isMdUp,
    consulted: isMdUp,
    read_later: isMdUp,
    liked: isMdUp,
  };
}

export function getArticleColumns(isMdUp: boolean): GridColDef[] {
  return [
    {
      field: 'title',
      flex: 1,
      minWidth: isMdUp ? 200 : 140,
      renderHeader: () => <strong className="fs-5">{'Title'}</strong>,
      renderCell: (params) => (
        <ArticleLink
          id={params.row.id}
          style={{ textDecoration: params.row.consulted ? 'line-through' : 'none' }}
          className="text-inherit hover:text-indigo-600 dark:hover:text-indigo-300"
        >
          {params.row.title}
        </ArticleLink>
      ),
    },
    {
      field: 'author',
      width: isMdUp ? 150 : 110,
      renderHeader: () => <strong className="fs-5">{'Author'}</strong>,
    },
    {
      field: 'year',
      renderHeader: () => <strong className="fs-5">{'Year'}</strong>,
    },
    {
      field: 'date_creation',
      renderCell: (params) => {
        const date = new Date(params.row.date_creation);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
      renderHeader: () => <strong className="fs-5">{'Created'}</strong>,
    },
    {
      field: 'consulted',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => <strong className="fs-5">{'Consulted'}</strong>,
      renderCell: (params) => <StatusIcon active={params.row.consulted} />,
    },
    {
      field: 'read_later',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => <strong className="fs-5">{'Read later'}</strong>,
      renderCell: (params) => <StatusIcon active={params.row.read_later} />,
    },
    {
      field: 'liked',
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => <strong className="fs-5">{'Liked'}</strong>,
      renderCell: (params) => (
        <span
          className={`inline-flex h-8 w-8 items-center justify-center ${
            params.row.liked ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'
          }`}
          aria-label={params.row.liked ? 'Liked' : 'Not liked'}
          title={params.row.liked ? 'Liked' : 'Not liked'}
        >
          <Heart size={18} fill={params.row.liked ? 'currentColor' : 'none'} aria-hidden="true" />
        </span>
      ),
    },
    {
      field: 'actions',
      width: 72,
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => <strong className="fs-5">{'Edit'}</strong>,
      renderCell: (params) => <EditButton activeItem={params.row} />,
    },
  ];
}
