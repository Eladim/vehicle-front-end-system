import React from 'react';
import { useClient } from './ClientContext';

const LogoutButton = () => {
    const { logout } = useClient();

    return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;
