import React from "react";

const LoadingScreen = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 transition-opacity z-50">
            <div className="w-full h-full flex justify-center items-center text-custom-orange">
                {message}
            </div>
        </div>
    );
};

export default LoadingScreen;
