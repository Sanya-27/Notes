import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-purple-50 text-purple-900">
            <header className="bg-purple-700 text-white py-6">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-bold">About NoteBlock</h1>
                </div>
            </header>
            <main className="container mx-auto px-6 py-12">
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4 text-purple-800">Our Mission</h2>
                    <p className="text-lg mb-6">
                        At NoteBlock, our mission is to revolutionize the way you take notes. We believe that note-taking should be seamless, intuitive, and efficient. That's why we've designed NoteBlock to be a powerful tool that helps you capture your thoughts, organize your ideas, and manage your tasks with ease.
                    </p>
                    <p className="text-lg">
                        Whether you're a student, professional, or just someone who loves to jot down ideas, NoteBlock is here to enhance your productivity and make your note-taking experience enjoyable.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4 text-purple-800">Meet the Team</h2>


                </section>
            </main>
            <footer className="bg-purple-700 text-white py-6 text-center">
                <p className="text-sm">© 2024 NoteBlock. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default About;
