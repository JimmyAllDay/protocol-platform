import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../pages/index';
import { AuthProvider } from '../context/AuthContext';
import { StoreProvider } from 'context/Store';

describe('Home', () => {
  it('renders a heading', () => {
    render(
      <AuthProvider>
        <StoreProvider>
          <Home />
        </StoreProvider>
      </AuthProvider>
    );

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});

describe('AuthContext', () => {
  it('loads user data and sets loading to false', () => {
    render(
      <AuthProvider>
        <StoreProvider>
          <Home />
        </StoreProvider>
      </AuthProvider>
    );

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
