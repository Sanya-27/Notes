import React from 'react';

const Features = () => {
    return (
        <section className="bg-purple-100 text-purple-900 py-12 px-6">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-extrabold mb-6">Features of NoteBlock</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4">Easy Organization</h3>
                        <p className="text-lg">
                            Organize your notes with tags, categories, and a powerful search functionality that makes finding your notes a breeze.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4">Collaborative Features</h3>
                        <p className="text-lg">
                            Share your notes and collaborate with others in real-time, making teamwork and communication effortless.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4">Customizable Interface</h3>
                        <p className="text-lg">
                            Personalize your note-taking experience with various themes and settings to suit your style.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
