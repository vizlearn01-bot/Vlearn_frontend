import React from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const CenteredDialog = ({
    defaultOpen = false,
    onClose = null,
    component,
    title,
    children,
    size = "md",
    className = "",
}) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setOpen(defaultOpen);
    }, [defaultOpen]);

    return (
        <>
            {Boolean(component) && (
                <div className="cursor-pointer" onClick={() => setOpen(true)}>
                    {component}
                </div>
            )}
            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    if (onClose) {
                        onClose();
                    }
                }}
                className={classNames("relative z-10")}
            >
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex flex-col min-h-full justify-center items-center text-center">
                        <DialogPanel
                            transition
                            className={classNames(
                                "flex flex-col w-full p-4 transform text-left text-base transition data-closed:scale-105 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in",
                                Boolean(size == "sm") &&
                                    "max-w-xl sm:p-6 lg:p-8",
                                Boolean(size == "md") &&
                                    "max-w-3xl sm:p-6 lg:p-8",
                                Boolean(size == "lg") &&
                                    "max-w-5xl sm:p-6 lg:p-8",
                                Boolean(size == "full") && "flex-1"
                            )}
                        >
                            <div
                                className={classNames(
                                    "flex h-full flex-col bg-white shadow-xl overflow-y-auto px-4 py-8 flex-1",
                                    Boolean(size !== "full") && "rounded-lg"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    {Boolean(title) && (
                                        <DialogTitle className="text-lg font-medium text-gray-900">
                                            {title}
                                        </DialogTitle>
                                    )}
                                    <div className="ml-auto flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpen(false);
                                                if (onClose) {
                                                    onClose();
                                                }
                                            }}
                                            className="p-2 text-gray-400 hover:text-gray-500"
                                        >
                                            <span className="sr-only">
                                                Close panel
                                            </span>
                                            <XMarkIcon
                                                aria-hidden="true"
                                                className="h-6 w-6"
                                            />
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={classNames(
                                        "mt-4 flex flex-col flex-1",
                                        className
                                    )}
                                >
                                    {children}
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default CenteredDialog;
