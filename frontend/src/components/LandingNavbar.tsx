import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';

const LandingNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg z-50" role="navigation">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <img src={logo} alt="NoteBlock Logo" className="w-12 h-12 mr-4" />
                    <span
                        style={{ fontFamily: 'Caveat, cursive' }}
                        className="text-5xl font-bold text-shadow-lg hover:text-gray-200 transition"
                    >
                        NoteBlock
                    </span>
                </div>
                <ul className="flex space-x-8 text-lg" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                    <li>
                        <Link to="/" className="hover:text-gray-200 transition">Home</Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-gray-200 transition">About</Link>
                    </li>
                    <li>
                        <Link to="/features" className="hover:text-gray-200 transition">Features</Link>
                    </li>
                    <li>
                        <Link to="/contact" className="hover:text-gray-200 transition">Contact</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default LandingNavbar;
