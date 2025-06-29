import React from 'react';
import NotFoundSvg from './not-found.svg';
import { Link } from 'react-router-dom';

export default function NoMatchPage() {
    return (
        <section className="min-h-screen bg-gray-950 text-gray-300 px-4 pt-16 md:pt-24">
            <div className="w-full max-w-5xl mx-auto text-center py-12 px-8 border border-gray-700 rounded-2xl shadow-2xl bg-gray-900 bg-opacity-90 backdrop-blur-sm">

                {/* Visual Signal */}
                <img src={NotFoundSvg} alt="404 - Not Found" className="mx-auto w-64 md:w-80 lg:w-96 opacity-95 mb-10 animate-pulse" />

                {/* Massive Error Signal */}
                <p className="text-xl md:text-2xl text-yellow-300 italic mb-8">
                    Signal Lost — No Structure Detected
                </p>

                {/* Detail */}
                <p className="text-md md:text-lg text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                    You’ve warped to an empty grid, capsuleer. <br />
                    No station registered at this coordinate. Check your navigation link or return to HQ.
                </p>

                {/* Button */}
                <Link
                    to="/"
                    className="inline-block text-lg font-semibold bg-transparent hover:bg-yellow-300 text-yellow-300 hover:text-gray-900 border border-yellow-300 hover:border-transparent px-8 py-4 rounded-lg transition duration-200 shadow-md hover:shadow-xl"
                >
                    Return to HQ
                </Link>

            </div>
        </section>
    );
};

