import React from "react";
import { useFetcher } from "react-router";
import TextInput from "../../../forms/TextInput";
import Button from "../../../butttons/Button";
import {
    showResponseMessage,
    useMessagesContext,
} from "../../../context-providers/MessagesContextProvider";

const PasswordSetForm = ({ actionUrl }) => {
    const messagesContext = useMessagesContext();

    const passwordSetFetcher = useFetcher();
    const [passwordSetErrors, setPasswordSetErrors] = React.useState({});
    React.useEffect(() => {
        if (passwordSetFetcher.data) {
            if (passwordSetFetcher.data.responseCode === 200) {
                setPasswordSetErrors({});
                showResponseMessage(passwordSetFetcher.data, messagesContext);
            } else {
                setPasswordSetErrors(
                    passwordSetFetcher.data.responseData.errors
                );
            }
        }
    }, [passwordSetFetcher.data]);

    return (
        <passwordSetFetcher.Form
            method="post"
            action={actionUrl}
            className="bg-white shadow-2xs ring-1 ring-gray-900/5 sm:rounded-md"
        >
            <div className="px-4 py-6 sm:p-8">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {Boolean(passwordSetErrors.non_field_errors) &&
                        passwordSetErrors.non_field_errors.map(
                            (error, index) => (
                                <div key={index} className="col-span-full">
                                    <Alert
                                        severity="error"
                                        message={error}
                                        onDismiss={() => {
                                            setPasswordSetErrors(
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
                            label={"New Password"}
                            name={"new_password"}
                            type={"password"}
                            error={Boolean(passwordSetErrors.new_password)}
                            helpText={
                                Boolean(passwordSetErrors.new_password)
                                    ? passwordSetErrors.new_password
                                    : null
                            }
                        />
                    </div>

                    <div className="col-span-full">
                        <TextInput
                            label={"Confirm Password"}
                            name={"confirm_password"}
                            type={"password"}
                            error={Boolean(passwordSetErrors.confirm_password)}
                            helpText={
                                Boolean(passwordSetErrors.confirm_password)
                                    ? passwordSetErrors.confirm_password
                                    : null
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <Button type="submit">Save Changes</Button>
            </div>
        </passwordSetFetcher.Form>
    );
};

export default PasswordSetForm;
