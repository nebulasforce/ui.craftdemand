import { render } from '@/test-utils';
import { Logo } from './Logo';

describe('Welcome component', () => {
  it('has correct Next.js theming section link', () => {
    render(<Logo />);
    // expect(screen.getByText('Light')).toBeInTheDocument();
  });
});
