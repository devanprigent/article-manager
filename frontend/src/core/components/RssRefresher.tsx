import { useEffect, useRef } from 'react';

import { useRefreshRssFeeds } from '../../hooks/mutations';

// Asks the server once per app load to import new RSS entries. The server
// skips feeds fetched recently, so reloading the app stays cheap.
export function RssRefresher() {
  const { mutate: refresh } = useRefreshRssFeeds();
  // Guards against StrictMode running the effect twice.
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (hasRefreshed.current) {
      return;
    }
    hasRefreshed.current = true;
    refresh();
  }, [refresh]);

  return null;
}
