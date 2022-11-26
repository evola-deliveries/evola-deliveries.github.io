import React from 'react';
import NotFoundSvg from './not-found.svg';
import { Link } from 'react-router-dom';

export default function NoMatchPage() {
    return (
        <section>
            <div className="text-white">
                <div className="flex">
                    <div className="m-auto text-center">
                        <div>
                            <img src={NotFoundSvg} alt="404"/>
                        </div>
                        <p className="text-sm md:text-base text-yellow-300 p-2 mb-4">The stuff you were looking for doesn't exist
                        </p>
                        <Link to="/" className="bg-transparent hover:bg-yellow-300 text-yellow-300 hover:text-white rounded shadow hover:shadow-lg py-2 px-4 border border-yellow-300 hover:border-transparent">Home</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

