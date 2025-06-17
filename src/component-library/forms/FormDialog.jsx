import React from "react";
import CenteredDialog from "../dialogs/CenteredDialog";
import Button from "../butttons/Button";
import FormWrapper from "./FormWrapper";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const FormDialog = ({
    component = null,
    title = "",
    readOnly = false,
    actionUrl = "",
    method = "post",
    includesMultipart = false,
    onSuccess = null,
    setErrors = null,
    errors = {},
    defaultOpen = false,
    onClose = null,
    dialogSize = "md",
    className = "",
    children,
    formDataGroups,
    onFormSubmit,
    ...props
}) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setOpen(defaultOpen);
    }, [defaultOpen]);

    return (
        <>
            <CenteredDialog
                defaultOpen={open}
                onClose={() => {
                    setOpen(false);
                    if (onClose) {
                        onClose();
                    }
                }}
                title={title}
                component={
                    Boolean(component) && (
                        <div
                            onClick={() => {
                                setOpen(true);
                            }}
                        >
                            {Boolean(component) && component}
                        </div>
                    )
                }
                size={dialogSize}
            >
                <FormWrapper
                    formDataGroups={formDataGroups}
                    errors={errors}
                    setErrors={setErrors}
                    onSuccess={(data) => {
                        setErrors({});
                        setOpen(false);
                        if (onClose) {
                            onClose();
                        }
                        if (onSuccess) {
                            onSuccess(data.responseData);
                        }
                    }}
                    method={method}
                    action={actionUrl}
                    readOnly={readOnly}
                    onFormSubmit={onFormSubmit}
                    {...props}
                >
                    <div className={classNames("flex-1", className)}>
                        {children}
                    </div>
                    {!readOnly && (
                        <div className="pt-8 mt-auto flex space-x-2 justify-end">
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setOpen(false);
                                    if (onClose) {
                                        onClose();
                                    }
                                }}
                                className="min-w-24"
                            >
                                Cancel
                            </Button>
                            <Button className="min-w-24" type="submit">
                                Submit
                            </Button>
                        </div>
                    )}
                </FormWrapper>
            </CenteredDialog>
        </>
    );
};

export default FormDialog;
