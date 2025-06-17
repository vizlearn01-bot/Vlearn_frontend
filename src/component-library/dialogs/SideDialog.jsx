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

const SideDialog = ({
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

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                            <DialogPanel
                                transition
                                className={classNames(
                                    "pointer-events-auto w-screen transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700",
                                    Boolean(size == "sm") &&
                                        "max-w-md pl-10",
                                    Boolean(size == "md") &&
                                        "max-w-lg pl-10",
                                    Boolean(size == "lg") &&
                                        "max-w-2xl pl-10",
                                    Boolean(size == "full") && "flex-1"
                                )}
                            >
                                <div className="flex h-full flex-col bg-white shadow-xl overflow-y-auto px-4 py-6 sm:px-6">
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

                                    <div className={classNames("mt-4 flex-1", className)}>
                                        {children}
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
export default SideDialog;
