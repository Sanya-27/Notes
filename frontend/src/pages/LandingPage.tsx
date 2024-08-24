import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import bigImage from '../assets/img/notes_image.png';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-300 via-white to-purple-200 text-purple-900">
            <LandingNavbar />

            <div className="flex-grow flex flex-col lg:flex-row items-center justify-between px-8 mt-24 lg:mt-32">
                <div className="lg:w-1/2 lg:pr-8 flex-shrink-0 text-center lg:text-left">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-purple-900 mb-6">Capture Every Idea, Organize Every Thought</h1>
                    <p className="text-lg lg:text-xl text-purple-700 mb-8">
                        Capture your thoughts, organize your ideas, and enhance your productivity with NoteBlock – the ultimate note-taking application tailored for creators and thinkers.
                    </p>
                    <button
                        onClick={handleClick}
                        className="px-8 py-4 bg-white text-purple-600 rounded-lg shadow-lg hover:bg-purple-100 transition"
                    >
                        Get Started
                    </button>
                </div>

                <div className="lg:w-1/2 mt-12 lg:mt-0">
                    <img
                        src={bigImage}
                        alt="Showcase of NoteBlock"
                        className="rounded-lg shadow-lg max-w-full object-contain"
                    />
                </div>
            </div>

            <div className="py-16 bg-gradient-to-r from-purple-200 to-purple-300">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-extrabold text-purple-900 mb-12 text-center">What We Offer</h2>
                    <div className="flex flex-col lg:flex-row lg:justify-around lg:space-x-6">
                        <div className="lg:w-1/3 p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 mb-6 lg:mb-0">
                            <h3 className="text-2xl font-semibold text-purple-800 mb-4">Seamless Note-taking</h3>
                            <p className="text-purple-700">
                                Effortlessly capture and organize your thoughts with a streamlined, intuitive interface that adapts to your note-taking style.
                            </p>
                        </div>
                        <div className="lg:w-1/3 p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 mb-6 lg:mb-0">
                            <h3 className="text-2xl font-semibold text-purple-800 mb-4">Advanced Organization</h3>
                            <p className="text-purple-700">
                                Organize your notes with ease using advanced tagging, categorization, and search functionalities to keep everything in order.
                            </p>
                        </div>
                        <div className="lg:w-1/3 p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105">
                            <h3 className="text-2xl font-semibold text-purple-800 mb-4">Rich Formatting Options</h3>
                            <p className="text-purple-700">
                                Enhance your notes with various formatting options, including bold, italics, headings, and more, to make your notes as expressive as you need.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <footer className="w-full py-4 bg-white bg-opacity-75 shadow-lg flex justify-center items-center mt-auto">
                <p className="text-sm text-purple-600">© 2024 NoteBlock. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
