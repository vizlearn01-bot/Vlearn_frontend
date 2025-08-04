import React from 'react';
import { Plus, CircleCheckBig } from 'lucide-react';

function QuestionGroupManagement() {
    return (
        <div className="px-4 md:px-8 py-8">
            <div className="shadow-2xl border-2 border-gray-100 rounded-3xl p-4 md:p-8 w-full max-w-5xl mx-auto bg-gray-50">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                    <Plus strokeWidth={1.5} className="bg-custom-blue h-12 w-12 rounded-xl text-white" />
                    <div>
                        <h1 className="text-2xl font-bold">Create new Question</h1>
                        <p className="font-light">Add questions for students to practice</p>
                    </div>
                </div>

                {/* Form Section */}
                <form action="">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 mb-6">
                        {/* Related Video Dropdown */}
                        <div>
                            <label htmlFor="related-video" className="block mb-2">Related video</label>
                            <select
                                name="related-video"
                                id="related-video"
                                className="border border-gray-300 rounded-3xl py-2 px-4 w-full placeholder:text-sm placeholder:font-extralight placeholder:text-gray-400"
                            >
                                <option value="default">Pick a video related to the Questions</option>
                                <option value="hard">Chlorine and its compounds</option>
                                <option value="medium">Sulphur and its compounds</option>
                                <option value="easy">Nitrogen and its compounds</option>
                            </select>
                        </div>

                        {/* Title Input */}
                        <div>
                            <label htmlFor="title" className="block mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                className="border border-gray-300 rounded-3xl py-2 px-4 w-full placeholder:text-sm placeholder:font-extralight placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="duration" className="block mb-2">Duration</label>
                            <input
                                type="number"
                                name="duration"
                                placeholder="Duration (mins)"
                                className="border border-gray-300 rounded-3xl py-2 px-4 w-full placeholder:text-sm placeholder:font-extralight placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label htmlFor="description" className="block mb-2">Question group Description</label>
                        <textarea
                            name="description"
                            id="description"
                            className="w-full border border-gray-300 rounded-3xl h-42 py-3 px-4 placeholder:text-sm placeholder:font-extralight placeholder:text-gray-400"
                            placeholder="Enter the full question description"
                        ></textarea>
                    </div>
                    <button className='flex justify-center mx-auto bg-custom-blue text-white py-2 px-4 rounded-3xl shadow-2xl hover:cursor-pointer hover:bg-custom-orange'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default QuestionGroupManagement;
