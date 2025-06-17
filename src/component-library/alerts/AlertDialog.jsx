import React from "react";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import CenteredDialog from "../dialogs/CenteredDialog";
import Button from "../butttons/Button";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const AlertDialog = ({
    title = "",
    message = "",
    severity = "",
    component = null,
    defaultOpen = false,
    onClose = null,
    onConfirm = null,
}) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setOpen(defaultOpen);
    }, [defaultOpen]);

    const cancelButtonRef = React.useRef(null);

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
        <CenteredDialog
            defaultOpen={open}
            onClose={() => {
                setOpen(false);
                if (onClose) {
                    onClose();
                }
            }}
            title={
                <div className="flex items-center">
                    <div
                        className={classNames(
                            background[severity],
                            "mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
                        )}
                    >
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
                    <p className="h3 ml-2 text-lg">{title}</p>
                </div>
            }
            component={
                <div
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    {Boolean(component) && component}
                </div>
            }
        >
            <p className="text-gray-500 pl-12">{message}</p>
            <div className="flex space-x-2 w-full justify-end mt-4">
                <Button
                    color={severity}
                    type="button"
                    variant="outlined"
                    onClick={() => {
                        setOpen(false);
                        if (onClose) {
                            onClose();
                        }
                    }}
                    ref={cancelButtonRef}
                    className="min-w-32"
                >
                    Cancel
                </Button>
                <Button
                    color={severity}
                    type="button"
                    onClick={() => {
                        if (onConfirm) {
                            onConfirm();
                        } else {
                            setOpen(false);
                            if (onClose) {
                                onClose();
                            }
                        }
                    }}
                    className="min-w-32"
                >
                    Confirm
                </Button>
            </div>
        </CenteredDialog>
    );
};

export default AlertDialog;
