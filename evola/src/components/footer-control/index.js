import React from 'react';

export default function FooterControl() {
    return (
        <footer className="bg-gray-900 border-t border-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-400 font-mono tracking-wide">
                <p className="uppercase text-blue-400 font-semibold text-xs">Evola Deliveries</p>
                <p className="text-gray-500 mt-1">An Eve Online Corporation — Serving Capsuleers Across New Eden</p>
                <div className="mt-2 text-xs text-gray-600 italic">
                    © YC<span className="select-none">{new Date().getFullYear() - 1898}</span> – Fly safe, pilot o7
                </div>
            </div>
        </footer>
    );
}