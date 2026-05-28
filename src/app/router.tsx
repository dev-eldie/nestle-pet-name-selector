import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { BrowsePage } from '@/features/names/BrowsePage';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <BrowsePage /> },
      { path: '*', element: <div role="alert" className="p-8">Page not found.</div> },
    ],
  },
]);
