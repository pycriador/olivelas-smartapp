import { useState, useEffect, useCallback } from 'react';

export interface UrlPaginationOptions {
  defaultPage?: number;
  defaultPageSize?: number;
  paramPrefix?: string;
}

export interface UrlPaginationResult {
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  onPaginationChange: (page: number, size?: number) => void;
  resetToFirstPage: () => void;
}

function readPaginationFromUrl(
  pageParam: string,
  sizeParam: string,
  defaultPage: number,
  defaultPageSize: number
): { page: number; pageSize: number; hasParams: boolean } {
  if (typeof window === 'undefined') {
    return { page: defaultPage, pageSize: defaultPageSize, hasParams: false };
  }
  const params = new URLSearchParams(window.location.search);
  const rawPage = params.get(pageParam);
  const rawSize = params.get(sizeParam);
  const parsedPage = rawPage ? parseInt(rawPage, 10) : NaN;
  const parsedSize = rawSize ? parseInt(rawSize, 10) : NaN;

  const page = !Number.isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : defaultPage;
  const pageSize = !Number.isNaN(parsedSize) && parsedSize >= 1 ? parsedSize : defaultPageSize;
  const hasParams = rawPage !== null && rawSize !== null;

  return { page, pageSize, hasParams };
}

function writePaginationToUrl(
  pageParam: string,
  sizeParam: string,
  page: number,
  pageSize: number,
  replace: boolean = false
) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set(pageParam, String(page));
  url.searchParams.set(sizeParam, String(pageSize));
  const nextRelative = `${url.pathname}${url.search}${url.hash}`;
  const currentRelative = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextRelative !== currentRelative) {
    if (replace) {
      window.history.replaceState(window.history.state, '', nextRelative);
    } else {
      window.history.pushState(window.history.state, '', nextRelative);
    }
  }
}

/**
 * Synchronizes pagination state (`page` and `page_size`) with the browser URL query string.
 * Ensures the active page is always visible in the URL and supports browser Back/Forward navigation.
 */
export function useUrlPagination(
  defaultPageSize: number = 10,
  options?: UrlPaginationOptions
): UrlPaginationResult {
  const defaultPage = options?.defaultPage ?? 1;
  const prefix = options?.paramPrefix ? `${options.paramPrefix}_` : '';
  const pageParam = `${prefix}page`;
  const sizeParam = `${prefix}page_size`;

  const initial = readPaginationFromUrl(pageParam, sizeParam, defaultPage, defaultPageSize);
  const [currentPage, setCurrentPageState] = useState<number>(initial.page);
  const [pageSize, setPageSizeState] = useState<number>(initial.pageSize);

  // Ensure URL explicitly shows ?page=...&page_size=... on mount
  useEffect(() => {
    const current = readPaginationFromUrl(pageParam, sizeParam, defaultPage, defaultPageSize);
    setCurrentPageState(current.page);
    setPageSizeState(current.pageSize);
    writePaginationToUrl(pageParam, sizeParam, current.page, current.pageSize, true);
  }, [pageParam, sizeParam, defaultPage, defaultPageSize]);

  // Listen to browser Back/Forward (popstate) and custom route changes
  useEffect(() => {
    const syncFromLocation = () => {
      const current = readPaginationFromUrl(pageParam, sizeParam, defaultPage, defaultPageSize);
      setCurrentPageState(current.page);
      setPageSizeState(current.pageSize);
      if (!current.hasParams) {
        writePaginationToUrl(pageParam, sizeParam, current.page, current.pageSize, true);
      }
    };

    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('app-route-change', syncFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('app-route-change', syncFromLocation);
    };
  }, [pageParam, sizeParam, defaultPage, defaultPageSize]);

  const onPaginationChange = useCallback(
    (nextPage: number, nextSize?: number) => {
      const resolvedSize = nextSize && nextSize >= 1 ? nextSize : pageSize;
      const resolvedPage = resolvedSize !== pageSize ? 1 : Math.max(1, nextPage);
      setCurrentPageState(resolvedPage);
      setPageSizeState(resolvedSize);
      writePaginationToUrl(pageParam, sizeParam, resolvedPage, resolvedSize, false);
    },
    [pageParam, sizeParam, pageSize]
  );

  const setCurrentPage = useCallback(
    (nextPage: number) => {
      const resolvedPage = Math.max(1, nextPage);
      setCurrentPageState(resolvedPage);
      writePaginationToUrl(pageParam, sizeParam, resolvedPage, pageSize, false);
    },
    [pageParam, sizeParam, pageSize]
  );

  const setPageSize = useCallback(
    (nextSize: number) => {
      const resolvedSize = Math.max(1, nextSize);
      setCurrentPageState(1);
      setPageSizeState(resolvedSize);
      writePaginationToUrl(pageParam, sizeParam, 1, resolvedSize, false);
    },
    [pageParam, sizeParam]
  );

  const resetToFirstPage = useCallback(() => {
    setCurrentPageState((prev) => {
      if (prev !== 1) {
        writePaginationToUrl(pageParam, sizeParam, 1, pageSize, true);
      } else {
        writePaginationToUrl(pageParam, sizeParam, 1, pageSize, true);
      }
      return 1;
    });
  }, [pageParam, sizeParam, pageSize]);

  return {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    onPaginationChange,
    resetToFirstPage,
  };
}
