import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigService from '../../services/config-service';
import { Link } from 'react-router-dom';

export default function NavigationBar() {
    const { t, i18n } = useTranslation();
    const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

    useEffect(() => {
        const lang = i18n.language || i18n.languages?.[0] || 'en';
        const normalizedLang = lang.split('-')[0];
        setCurrentLang(normalizedLang);
    }, [i18n.language, i18n.languages]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setCurrentLang(lng);
    };

    return (
        <header className="bg-gray-900 border-b border-gray-700 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <h1 className="text-2xl font-extrabold text-blue-400 tracking-wide font-mono group-hover:text-white transition duration-150">
                        EVOLA <span className="text-red-500">Deliveries</span>
                    </h1>
                </Link>
                
                <div className="flex items-center space-x-6">
                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-400">
                        <Link to="/" className="hover:text-white transition duration-150">{t('nav.contracts')}</Link>
                        <a
                            href={ConfigService.discord_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:text-blue-300 transition duration-150"
                        >
                            {t('nav.joinDiscord')}
                        </a>
                    </nav>

                    {/* Language Selector */}
                    <select
                        value={currentLang}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-gray-200 text-sm px-2 py-1 rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="en">{t('language.en')}</option>
                        <option value="zh">{t('language.zh')}</option>
                        <option value="ru">{t('language.ru')}</option>
                    </select>
                </div>
            </div>
        </header>
    );
};
