import React from "react";
import {
    showResponseMessage,
    useMessagesContext,
} from "../context-providers/MessagesContextProvider";
import { useFetcher } from "react-router";
import { IconButton } from "../butttons/Button";
import AlertDialog from "../alerts/AlertDialog";
import { TrashIcon } from "@heroicons/react/24/outline";

const DeleteButton = ({
    component = (
        <IconButton color="error" variant="outlined">
            <TrashIcon aria-hidden="true" className="size-4" />
        </IconButton>
    ),
    title = "Delete item?",
    message = "Are you sure you want to delete this item?",
    actionUrl = "",
    showSuccessMessage = true,
    handleDelete,
    onSuccess,
}) => {
    const messagesContext = useMessagesContext();
    const deleteFetcher = useFetcher();
    const [deleteWarningDialogOpen, setDeleteWarningDialogOpen] =
        React.useState(false);
    const deleteButtonRef = React.useRef(null);

    React.useEffect(() => {
        if (deleteFetcher.data) {
            if (deleteFetcher.data.responseCode === 200) {
                setDeleteWarningDialogOpen(false);
            }
            if (showSuccessMessage) {
                showResponseMessage(deleteFetcher.data, messagesContext);
            }
            if (onSuccess) {
                onSuccess();
            }
        }
    }, [deleteFetcher.data]);

    return (
        <>
            <deleteFetcher.Form method="delete" action={actionUrl}>
                <button type="submit" className="hidden" ref={deleteButtonRef}>
                    Delete
                </button>
            </deleteFetcher.Form>
            <AlertDialog
                defaultOpen={deleteWarningDialogOpen}
                onClose={() => setDeleteWarningDialogOpen(false)}
                severity="error"
                title={title}
                message={message}
                component={component}
                onConfirm={() => {
                    if (handleDelete) {
                        handleDelete();
                        setDeleteWarningDialogOpen(false);
                    } else {
                        deleteButtonRef.current.click();
                    }
                }}
            />
        </>
    );
};

export default DeleteButton;
