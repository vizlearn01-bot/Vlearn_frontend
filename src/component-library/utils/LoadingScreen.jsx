import React from "react";

const LoadingScreen = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity z-50">
            <div className="w-full h-full flex justify-center items-center text-white">
                {message}
            </div>
        </div>
    );
};

export default LoadingScreen;
