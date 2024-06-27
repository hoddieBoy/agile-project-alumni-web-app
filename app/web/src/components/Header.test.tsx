// Header.test.tsx
import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from './Header';
import {logout} from 'utils/Auth';

// Mock the logout function
jest.mock('utils/Auth', () => ({
    logout: jest.fn(),
}));

describe('Header component', () => {
    it('renders without crashing', () => {
        const {asFragment} = render(<Header/>);
        expect(asFragment()).toMatchSnapshot();
    });

    describe('renders the header elements', () => {
        it('renders the logo with correct attributes', () => {
            render(<Header/>);
            const logo = screen.getByAltText('IMT Atlantique Logo');
            expect(logo).toBeInTheDocument();
            expect(logo).toHaveAttribute('src', 'https://www.imt-atlantique.fr/sites/default/files/Images/Ecole/charte-graphique/IMT_Atlantique_logo_RVB_Negatif_Baseline_400x272.png');
        });

        it('renders the search input with correct attributes', () => {
            render(<Header/>);
            const searchInput = screen.getByPlaceholderText('Search');
            expect(searchInput).toBeInTheDocument();
            expect(searchInput).toHaveAttribute('type', 'text');
        });

        it('renders navigation links', () => {
            render(<Header/>);
            const links = ['Search', 'Import/Export', 'Gestion Utilisateurs'];
            links.forEach(link => {
                const navLink = screen.getByText(link);
                expect(navLink).toBeInTheDocument();
                expect(navLink).toHaveAttribute('href', `/${link.toLowerCase().replace(/\s/g, '-')}`);
            });
        });

        it('renders the logout button', () => {
            render(<Header/>);
            const logoutButton = screen.getByRole('button', {name: /log out/i});
            expect(logoutButton).toBeInTheDocument();
            expect(logoutButton).toHaveClass('btn btn-primary');
        });
    })

    it('calls logout function when logout button is clicked', () => {
        render(<Header/>);
        const logoutButton = screen.getByRole('button', {name: /log out/i});
        fireEvent.click(logoutButton);
        expect(logout).toHaveBeenCalled();
    });
});