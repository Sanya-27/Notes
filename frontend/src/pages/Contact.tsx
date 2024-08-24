import React from 'react';

const Contact = () => {
    return (
        <section className="bg-white text-purple-900 py-12 px-6">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-extrabold mb-6">Contact Us</h2>
                <p className="text-lg mb-6">
                    We would love to hear from you! Whether you have questions, feedback, or need support, feel free to reach out to us.
                </p>
                <div className="max-w-lg mx-auto">
                    <form className="bg-purple-100 p-8 rounded-lg shadow-lg">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-lg font-semibold mb-2">Name</label>
                            <input type="text" id="name" className="w-full p-3 border border-purple-300 rounded-lg" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-lg font-semibold mb-2">Email</label>
                            <input type="email" id="email" className="w-full p-3 border border-purple-300 rounded-lg" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-lg font-semibold mb-2">Message</label>
                            <textarea id="message" rows={4} className="w-full p-3 border border-purple-300 rounded-lg"></textarea>
                        </div>
                        <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                            Send Message
                        </button>
                    </form>
                </div>
                <div className="mt-8">
                    <p className="text-lg">Or reach us at:</p>
                    <p className="text-lg font-semibold">support@noteblock.com</p>
                </div>
            </div>
        </section>
    );
};

export default Contact;
