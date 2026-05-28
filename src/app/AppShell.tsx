import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Skeleton } from '@/components/Skeleton';

export function AppShell() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}
