import React, { useState } from "react";
import Button from "../butttons/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const Slider = ({
    slides,
    onComplete,
    showProgress = true,
    customNavigation,
    className = "",
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else if (onComplete) {
            onComplete(currentSlide);
        }
    };

    const handleBack = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="">
                {showProgress && (
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {slides.map((slide, index) => (
                                <span
                                    key={index}
                                    className={`text-sm ${
                                        index <= currentSlide
                                            ? "text-blue-600"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {slide.title}
                                </span>
                            ))}
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                style={{
                                    width: `${
                                        ((currentSlide + 1) / slides.length) *
                                        100
                                    }%`,
                                }}
                            />
                        </div>
                    </div>
                )}
                <div className="min-h-64 transition-opacity duration-300">
                    {slides[currentSlide].children}
                </div>
                {customNavigation || (
                    <div className="flex justify-between mt-8">
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={handleBack}
                            disabled={currentSlide === 0}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back
                        </Button>

                        <Button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2"
                        >
                            {currentSlide === slides.length - 1
                                ? "Finish"
                                : "Next"}
                            <ArrowRightIcon className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Slider;
