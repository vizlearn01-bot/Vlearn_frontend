import React from "react";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Alert = ({
    severity = "",
    message = "",
    onDismiss = null,
    className,
}) => {
    const background = {
        success: "bg-green-50",
        error: "bg-red-50",
        warning: "bg-yellow-50",
        info: "bg-blue-50",
    };

    const textColor = {
        success: "text-green-800",
        error: "text-red-800",
        warning: "text-yellow-800",
        info: "text-blue-800",
    };

    return (
        <div
            className={classNames(
                background[severity],
                "rounded-md p-4",
                className
            )}
        >
            <div className="flex">
                <div className="shrink-0">
                    {Boolean(severity == "info") && (
                        <InformationCircleIcon
                            className={classNames(
                                background[severity],
                                textColor[severity],
                                "h-5 w-5"
                            )}
                            aria-hidden="true"
                        />
                    )}
                    {Boolean(severity == "warning") && (
                        <ExclamationTriangleIcon
                            className={classNames(
                                background[severity],
                                textColor[severity],
                                "h-5 w-5"
                            )}
                            aria-hidden="true"
                        />
                    )}
                    {Boolean(severity == "error") && (
                        <XCircleIcon
                            className={classNames(
                                background[severity],
                                textColor[severity],
                                "h-5 w-5"
                            )}
                            aria-hidden="true"
                        />
                    )}
                    {Boolean(severity == "success") && (
                        <CheckCircleIcon
                            className={classNames(
                                background[severity],
                                textColor[severity],
                                "h-5 w-5"
                            )}
                            aria-hidden="true"
                        />
                    )}
                </div>
                <div className="ml-3">
                    <p
                        className={classNames(
                            textColor[severity],
                            "text-sm font-medium"
                        )}
                    >
                        {message}
                    </p>
                </div>
                {Boolean(onDismiss) && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                onClick={onDismiss}
                                type="button"
                                className={classNames(
                                    background[severity],
                                    textColor[severity],
                                    "inline-flex rounded-md p-1.5"
                                )}
                            >
                                <span className="sr-only">Dismiss</span>
                                <XMarkIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alert;
