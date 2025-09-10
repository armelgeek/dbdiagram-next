import { useQueryState } from 'nuqs';
import { parseAsArrayOf, parseAsInteger, parseAsString } from 'nuqs/server';

export function useQueryStateParams() {
  const [search] = useQueryState('q', { defaultValue: '' });
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));
  const [sortBy] = useQueryState('sortBy', { defaultValue: '' });
  const [sortDir] = useQueryState('sortDir', { defaultValue: '' });
  const [status] = useQueryState('status', parseAsArrayOf(parseAsString));

  return { search, page, pageSize, sortBy, sortDir, status };
}
