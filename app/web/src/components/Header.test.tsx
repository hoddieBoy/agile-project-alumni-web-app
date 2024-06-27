// Header.test.tsx
import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from './Header';
import {AuthContext, AuthContextType} from 'context/AuthContext';

// Create a custom render method that includes the AuthContext provider
const renderWithAuthContext = (contextValue: Partial<AuthContextType>, component: React.ReactNode) => {
    return render(
        <AuthContext.Provider value={contextValue as AuthContextType}>
            {component}
        </AuthContext.Provider>
    );
};

describe('Header component', () => {
    let mockLogout: jest.Mock;

    beforeEach(() => {
        mockLogout = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        const {asFragment} = renderWithAuthContext({logout: mockLogout, isAuthenticated: true}, <Header/>);
        expect(asFragment()).toMatchSnapshot();
    });

    describe('renders the header elements', () => {
        it('renders the logo with correct attributes', () => {
            renderWithAuthContext({logout: mockLogout, isAuthenticated: true}, <Header/>);
            const logo = screen.getByAltText('IMT Atlantique Logo');
            expect(logo).toBeInTheDocument();
            expect(logo).toHaveAttribute('src', 'https://www.imt-atlantique.fr/sites/default/files/Images/Ecole/charte-graphique/IMT_Atlantique_logo_RVB_Negatif_Baseline_400x272.png');
        });

        it('renders the search input with correct attributes', () => {
            renderWithAuthContext({logout: mockLogout, isAuthenticated: true}, <Header/>);
            const searchInput = screen.getByPlaceholderText('Search');
            expect(searchInput).toBeInTheDocument();
            expect(searchInput).toHaveAttribute('type', 'text');
        });

        it('renders navigation links', () => {
            renderWithAuthContext({logout: mockLogout, isAuthenticated: true}, <Header/>);
            const links = ['Search', 'Import-Export', 'Gestion Utilisateurs', 'Stat'];
            links.forEach(link => {
                const navLink = screen.getByText(link);
                expect(navLink).toBeInTheDocument();
                expect(navLink).toHaveAttribute('href', `/${link.toLowerCase().replace(/\s/g, '-')}`);
            });
        });

        it('renders the logout button', () => {
            renderWithAuthContext({logout: mockLogout, isAuthenticated: true}, <Header/>);
            const logoutButton = screen.getByRole('button', {name: /log out/i});
            expect(logoutButton).toBeInTheDocument();
            expect(logoutButton).toHaveClass('btn btn-primary');
        });
    });

    it('calls logout function when logout button is clicked', () => {
        renderWithAuthContext({logout: mockLogout, isAuthenticated: true}, <Header/>);
        const logoutButton = screen.getByRole('button', {name: /log out/i});
        fireEvent.click(logoutButton);
        expect(mockLogout).toHaveBeenCalled();
    });
});