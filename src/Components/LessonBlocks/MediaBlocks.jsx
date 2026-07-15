import React from 'react';
import ReactPlayer from 'react-player';
import { Image as ImageIcon, PlayCircle, Video, Settings, Loader2, FlaskConical } from 'lucide-react';

export const ImagePlaceholderBlock = ({ block }) => {
    const content = typeof block.content === 'string' ? JSON.parse(block.content) : block.content;
    
    // If the image is resolved by editors
    if (content.resolved_image_url) {
        return (
            <div className="my-10 flex flex-col items-center">
                <figure className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl w-full hover:shadow-md transition-shadow">
                    <img src={content.resolved_image_url} alt={block.title} className="w-full h-auto object-cover rounded-xl" />
                    {block.title && <figcaption className="text-gray-500 mt-4 mb-2 text-sm text-center font-medium px-4">{block.title}</figcaption>}
                </figure>
            </div>
        );
    }
    
    // Fallback to placeholder
    return (
        <div className="my-10 bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center flex flex-col items-center">
            <ImageIcon className="text-slate-400 w-12 h-12 mb-3" />
            <h3 className="text-slate-700 font-bold mb-2">Image Placeholder: {block.title}</h3>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">Description: {content.description}</p>
        </div>
    );
};

export const VideoRefBlock = ({ block }) => {
    const content = typeof block.content === 'string' ? JSON.parse(block.content) : block.content;
    
    return (
        <div className="my-12 bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800">
            <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg font-bold text-white m-0 flex items-center gap-2">
                    <PlayCircle className="text-red-500 w-5 h-5 shrink-0" /> {block.title || 'Video Resource'}
                </h2>
                {content.learning_objective && (
                    <span className="text-slate-400 text-xs font-medium bg-slate-800 px-3 py-1.5 rounded-full border border-slate-600/50">
                        Objective: {content.learning_objective}
                    </span>
                )}
            </div>
            
            {content.resolved_video_id ? (
                <div className="aspect-w-16 aspect-h-9 bg-black w-full relative">
                    <iframe 
                        className="w-full h-[400px] md:h-[500px]"
                        src={`https://www.youtube.com/embed/${content.resolved_video_id}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <div className="bg-slate-800/50 border-t border-slate-800 p-16 flex flex-col items-center text-center">
                    <Video className="text-slate-500 w-12 h-12 mb-4 opacity-50" />
                    <p className="text-slate-400 font-medium">Video Placeholder</p>
                    <p className="text-slate-500 text-sm mt-2">Waiting for video resource to be attached.</p>
                </div>
            )}
        </div>
    );
};

export const SimulationPlaceholderBlock = ({ block }) => {
    const content = typeof block.content === 'string' ? JSON.parse(block.content) : block.content;
    
    return (
        <div className="my-10 bg-cyan-50 border border-cyan-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <Settings className="text-cyan-600 w-8 h-8 shrink-0" />
                <h2 className="text-xl font-bold text-cyan-900 m-0">{block.title || 'Interactive Simulation'}</h2>
            </div>
            <p className="text-cyan-800 mb-6 bg-white/50 p-4 rounded-xl border border-cyan-100 text-sm">
                <span className="font-bold uppercase tracking-wider text-xs mr-2">Objective:</span> 
                {content.simulation_objective}
            </p>
            
            {content.resolved_simulation_id ? (
                <div className="h-80 bg-white rounded-2xl flex items-center justify-center border-2 border-cyan-300 shadow-inner overflow-hidden">
                    <div className="flex flex-col items-center text-center">
                        <Loader2 className="text-cyan-500 w-10 h-10 mb-3 animate-spin" />
                        <p className="text-cyan-700 font-bold">Interactive Simulation Loading...</p>
                        <p className="text-cyan-500 text-xs mt-2">ID: {content.resolved_simulation_id}</p>
                    </div>
                </div>
            ) : (
                <div className="h-48 bg-white border border-dashed border-cyan-300 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                    <FlaskConical className="text-cyan-400 w-10 h-10 mb-2 opacity-50" />
                    <p className="text-cyan-600 font-medium">Simulation Placeholder</p>
                </div>
            )}
        </div>
    );
};
