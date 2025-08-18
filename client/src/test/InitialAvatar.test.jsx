import { render, screen } from '@testing-library/react';
import InitialAvatar from '../components/UI/InitialAvatar';

describe('InitialAvatar', () => {
  it('renders the image when src is provided', () => {
    const testSrc = 'https://example.com/avatar.png';
    render(<InitialAvatar src={testSrc} name="John Doe" />);
    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', testSrc);
  });

  it('renders initials when src is not provided', () => {
    render(<InitialAvatar name="John Doe" />);
    const initialsElement = screen.getByText('JD');
    expect(initialsElement).toBeInTheDocument();
  });

  it('renders an editable overlay when editable is true', () => {
    render(<InitialAvatar name="John Doe" editable />);
    const pencilIcon = screen.getByRole('button', { hidden: true });
    expect(pencilIcon).toBeInTheDocument();
  });
});
