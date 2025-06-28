import { render, screen } from '@/test-utils';
import { ColorSchemeToggle } from './ColorSchemeToggle';

describe('Welcome component', () => {
  it('has correct Next.js theming section link', () => {
    render(<ColorSchemeToggle />);
    expect(screen.getByText('Light')).toBeInTheDocument();
  });
});
