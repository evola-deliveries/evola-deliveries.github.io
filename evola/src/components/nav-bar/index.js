import React from 'react';
import { Link } from 'react-router-dom';

export default function NavigationBar() {
    return (
        <header className="px-4 py-4 bg-gray-600">
            <Link to="/"><h1 className="text-white relative text-2xl font-bold font-sans italic leading-none text-left">EVOLA <span className="text-red-500">Deliveries</span></h1></Link>
        </header>
    );
};