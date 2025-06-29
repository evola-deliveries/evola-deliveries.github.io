import React from 'react';
import ConfigService from '../../services/config-service';
import { Link } from 'react-router-dom';
import { LoginButton } from '../esi-login-button';

export default function NavigationBar() {
    return (
        <header className="bg-gray-900 border-b border-gray-700 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <h1 className="text-2xl font-extrabold text-blue-400 tracking-wide font-mono group-hover:text-white transition duration-150">
                        EVOLA <span className="text-red-500">Deliveries</span>
                    </h1>
                </Link>
                

                {/* Navigation (optional links - placeholder) */}
                <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-400">
                    <Link to="/" className="hover:text-white transition duration-150">Contracts</Link>
                    <LoginButton />
                    <a
                        href={ConfigService.discord_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:text-blue-300 transition duration-150"
                    >
                        Join Discord
                    </a>
                </nav>
            </div>
        </header>
    );
};