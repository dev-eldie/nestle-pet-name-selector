import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltersBar } from './FiltersBar';
import type { Category } from '@/types/domain';

const cats: Category[] = [
  { id: 'c1', name: 'Cartoon', description: null },
  { id: 'c2', name: 'Disney', description: null },
  { id: 'c3', name: 'Greek', description: null },
];

describe('<FiltersBar />', () => {
  it('renders all group labels', () => {
    render(
      <FiltersBar
        categories={cats}
        selectedIds={[]}
        openGroupKey={null}
        onToggleGroup={() => {}}
        onCloseGroup={() => {}}
        onToggleCategory={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /Funny/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /International/ })).toBeInTheDocument();
  });

  it('shows the open group panel with its sub-categories', () => {
    render(
      <FiltersBar
        categories={cats}
        selectedIds={['c2']}
        openGroupKey="funny"
        onToggleGroup={() => {}}
        onCloseGroup={() => {}}
        onToggleCategory={() => {}}
      />,
    );
    expect(screen.getByText('Cartoon')).toBeInTheDocument();
    expect(screen.getByText('Disney')).toBeInTheDocument();
    expect(screen.getByLabelText('Disney')).toBeChecked();
  });

  it('toggles a category on checkbox click', async () => {
    const user = userEvent.setup();
    const onToggleCategory = vi.fn();
    render(
      <FiltersBar
        categories={cats}
        selectedIds={[]}
        openGroupKey="funny"
        onToggleGroup={() => {}}
        onCloseGroup={() => {}}
        onToggleCategory={onToggleCategory}
      />,
    );
    await user.click(screen.getByLabelText('Cartoon'));
    expect(onToggleCategory).toHaveBeenCalledWith('c1');
  });
});
