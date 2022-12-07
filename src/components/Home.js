import React from 'react';
import AuthorizationPanel from './AuthorizationPanel/AuthorizationPanel';
import Outlet from './Outlet/Outlet';
import SearchBar from './SearchBar/SearchBar';
import TitlesGrid from './TitlesGrid/TitlesGrid';
import TypeSwitch from './TypeSwitch/TypeSwitch';

function Home() {
    return (
        <Outlet leftBlock={<TypeSwitch />} centerBlock={<SearchBar />} rightBlock={<AuthorizationPanel />}>
            <TitlesGrid />
        </Outlet>
    );
}

export default Home;
