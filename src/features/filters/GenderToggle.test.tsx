import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenderToggle } from './GenderToggle';

describe('<GenderToggle />', () => {
  it('marks the current value as checked', () => {
    render(<GenderToggle value="M" onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: 'Male' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Female' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'Both' })).toHaveAttribute('aria-checked', 'false');
  });

  it('starts with nothing checked when value is null', () => {
    render(<GenderToggle value={null} onChange={() => {}} />);
    for (const label of ['Male', 'Female', 'Both']) {
      expect(screen.getByRole('radio', { name: label })).toHaveAttribute('aria-checked', 'false');
    }
  });

  it('fires onChange with the clicked value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<GenderToggle value={null} onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'Female' }));
    expect(onChange).toHaveBeenCalledWith('F');
  });
});
