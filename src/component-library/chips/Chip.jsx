import React from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Chip = ({ label, actions, className = "ring-gray-200" }) => {
    return (
        <div
            className={classNames(
                "inline-flex rounded-full ring-1 ring-inset",
                className
            )}
        >
            <p
                className={classNames(
                    "pointer-events-none inline-flex items-center rounded-l-full px-3 py-2 text-sm font-semibold whitespace-nowrap",
                    Boolean(actions) ? "border-r" : "rounded-r-full"
                )}
            >
                {label}
            </p>
            <div className="inline-flex items-center rounded-r-full pr-1">
                {actions}
            </div>
        </div>
    );
};

export default Chip;
