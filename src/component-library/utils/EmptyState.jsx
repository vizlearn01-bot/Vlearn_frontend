import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const EmptyState = ({
    icon = <DocumentMagnifyingGlassIcon />,
    title = "Nothing here yet.",
    message = null,
    actionButton = null,
    className = "",
}) => {
    return (
        <div
            className={classNames(
                "text-center py-10 flex flex-col items-center",
                className
            )}
        >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full text-gray-500">
                {icon}
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-500">
                {title}
            </h3>
            {Boolean(message) && (
                <p className="mt-1 text-sm text-gray-400">{message}</p>
            )}
            {Boolean(actionButton) && (
                <div className="mt-6">{actionButton}</div>
            )}
        </div>
    );
};

export default EmptyState;
