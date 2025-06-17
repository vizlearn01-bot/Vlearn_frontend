import React from "react";
import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
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

const Notification = ({
    severity = "",
    message = "",
    title = "",
    onDismiss = null,
    autoDismiss = true,
}) => {
    const [show, setShow] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(5);

    React.useEffect(() => {
        if (autoDismiss) {
            const timer = setTimeout(() => {
                if (onDismiss) {
                    onDismiss();
                }
            }, timeRemaining * 1000);
            return () => clearTimeout(timer);
        }
    }, [timeRemaining]);

    const textColor = {
        success: "text-green-800",
        error: "text-red-800",
        warning: "text-yellow-800",
        info: "text-blue-800",
    };

    return (
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            <Transition
                show={show}
                as={Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="shrink-0">
                                {Boolean(severity == "info") && (
                                    <InformationCircleIcon
                                        className={classNames(
                                            textColor[severity],
                                            "h-5 w-5"
                                        )}
                                        aria-hidden="true"
                                    />
                                )}
                                {Boolean(severity == "warning") && (
                                    <ExclamationTriangleIcon
                                        className={classNames(
                                            textColor[severity],
                                            "h-5 w-5"
                                        )}
                                        aria-hidden="true"
                                    />
                                )}
                                {Boolean(severity == "error") && (
                                    <XCircleIcon
                                        className={classNames(
                                            textColor[severity],
                                            "h-5 w-5"
                                        )}
                                        aria-hidden="true"
                                    />
                                )}
                                {Boolean(severity == "success") && (
                                    <CheckCircleIcon
                                        className={classNames(
                                            textColor[severity],
                                            "h-5 w-5"
                                        )}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p
                                    className={classNames(
                                        textColor[severity],
                                        "text-sm font-medium"
                                    )}
                                >
                                    {title}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {message}
                                </p>
                            </div>
                            <div className="ml-4 flex shrink-0">
                                <button
                                    type="button"
                                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={() => {
                                        if (onDismiss) {
                                            onDismiss();
                                        }
                                        setShow(false);
                                    }}
                                >
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default Notification;
