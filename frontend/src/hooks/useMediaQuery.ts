import { useSyncExternalStore } from 'react';

function subscribe(query: string, onStoreChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
}

function getSnapshot(query: string) {
  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => getSnapshot(query),
    () => false,
  );
}
