import React from "react";
import { useFetcher } from "react-router";
import TextInput from "../../../forms/TextInput";
import Button from "../../../butttons/Button";
import { showResponseMessage, useMessagesContext } from "../../../context-providers/MessagesContextProvider";

const PasswordChangeForm = ({ actionUrl }) => {
    const messagesContext = useMessagesContext();

    const passwordChangeFetcher = useFetcher();
    const [passwordChangeErrors, setPasswordChangeErrors] = React.useState({});
    React.useEffect(() => {
        if (passwordChangeFetcher.data) {
            if (passwordChangeFetcher.data.responseCode === 200) {
                setPasswordChangeErrors({});
                showResponseMessage(
                    passwordChangeFetcher.data,
                    messagesContext
                );
            } else {
                setPasswordChangeErrors(
                    passwordChangeFetcher.data.responseData.errors
                );
            }
        }
    }, [passwordChangeFetcher.data]);
    return (
        <>
            <passwordChangeFetcher.Form
                method="post" 
                action={actionUrl}
                className="bg-white shadow-2xs ring-1 ring-gray-900/5 sm:rounded-md"
            >
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        {Boolean(passwordChangeErrors.non_field_errors) &&
                            passwordChangeErrors.non_field_errors.map(
                                (error, index) => (
                                    <div key={index} className="col-span-full">
                                        <Alert
                                            severity="error"
                                            message={error}
                                            onDismiss={() => {
                                                setPasswordChangeErrors(
                                                    (prevErrors) => {
                                                        const newErrors = {
                                                            ...prevErrors,
                                                        };
                                                        delete newErrors
                                                            .non_field_errors[
                                                            index
                                                        ];
                                                        return newErrors;
                                                    }
                                                );
                                            }}
                                        />
                                    </div>
                                )
                            )}
                        <div className="col-span-full">
                            <TextInput
                                label={"Old Password"}
                                name={"old_password"}
                                type={"password"}
                                error={Boolean(
                                    passwordChangeErrors.old_password
                                )}
                                helpText={
                                    Boolean(passwordChangeErrors.old_password)
                                        ? passwordChangeErrors.old_password
                                        : null
                                }
                            />
                        </div>

                        <div className="col-span-full">
                            <TextInput
                                label={"New Password"}
                                name={"new_password"}
                                type={"password"}
                                error={Boolean(
                                    passwordChangeErrors.new_password
                                )}
                                helpText={
                                    Boolean(passwordChangeErrors.new_password)
                                        ? passwordChangeErrors.new_password
                                        : null
                                }
                            />
                        </div>

                        <div className="col-span-full">
                            <TextInput
                                label={"Confirm Password"}
                                name={"confirm_password"}
                                type={"password"}
                                error={Boolean(
                                    passwordChangeErrors.confirm_password
                                )}
                                helpText={
                                    Boolean(
                                        passwordChangeErrors.confirm_password
                                    )
                                        ? passwordChangeErrors.confirm_password
                                        : null
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <Button type="submit">Save Changes</Button>
                </div>
            </passwordChangeFetcher.Form>
        </>
    );
};

export default PasswordChangeForm;
