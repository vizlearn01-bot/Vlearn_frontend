import React from "react";
import { useFetcher } from "react-router";
import TextInput from "../../../forms/TextInput";
import Button from "../../../butttons/Button";
import {
    showResponseMessage,
    useMessagesContext,
} from "../../../context-providers/MessagesContextProvider";

const UserPersonalDetailsForm = ({ initial, actionUrl }) => {
    const messagesContext = useMessagesContext();
    const [userDetails, setUserDetails] = React.useState({});
    React.useEffect(() => {
        if (initial) {
            setUserDetails(initial);
        }
    }, [initial]);

    const userDetailsFetcher = useFetcher();
    const [userDetailsErrors, setUserDetailsErrors] = React.useState({});

    React.useEffect(() => {
        if (userDetailsFetcher.data) {
            if (userDetailsFetcher.data.responseCode === 200) {
                setUserDetailsErrors({});
                showResponseMessage(userDetailsFetcher.data, messagesContext);
            } else {
                setUserDetailsErrors(
                    userDetailsFetcher.data.responseData.errors
                );
            }
        }
    }, [userDetailsFetcher.data]);

    return (
        <>
            <userDetailsFetcher.Form
                method="patch"
                action={actionUrl}
                className="bg-white shadow-2xs ring-1 ring-gray-900/5 sm:rounded-md"
            >
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <TextInput
                                label={"First Name"}
                                name={"first_name"}
                                error={Boolean(userDetailsErrors.first_name)}
                                helpText={
                                    Boolean(userDetailsErrors.first_name)
                                        ? userDetailsErrors.first_name
                                        : null
                                }
                                defaultValue={userDetails?.first_name}
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <TextInput
                                label={"Last Name"}
                                name={"last_name"}
                                error={Boolean(userDetailsErrors.last_name)}
                                helpText={
                                    Boolean(userDetailsErrors.last_name)
                                        ? userDetailsErrors.last_name
                                        : null
                                }
                                defaultValue={userDetails?.last_name}
                            />
                        </div>

                        <div className="sm:col-span-full">
                            <TextInput
                                label={"Email"}
                                name={"email"}
                                required={false}
                                error={Boolean(userDetailsErrors.email)}
                                helpText={
                                    Boolean(userDetailsErrors.email)
                                        ? userDetailsErrors.email
                                        : null
                                }
                                defaultValue={userDetails?.email}
                            />
                        </div>

                        <div className="sm:col-span-full">
                            <TextInput
                                label={"Phone Number"}
                                name={"phone_number"}
                                error={Boolean(userDetailsErrors.phone_number)}
                                helpText={
                                    Boolean(userDetailsErrors.phone_number)
                                        ? userDetailsErrors.phone_number
                                        : null
                                }
                                defaultValue={userDetails?.phone_number}
                                required={false}
                            />
                        </div>

                        <div className="sm:col-span-full">
                            <TextInput
                                label={"Username"}
                                name={"username"}
                                error={Boolean(userDetailsErrors.username)}
                                helpText={
                                    Boolean(userDetailsErrors.username)
                                        ? userDetailsErrors.username
                                        : null
                                }
                                defaultValue={userDetails?.username}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <Button type="submit">Save Changes</Button>
                </div>
            </userDetailsFetcher.Form>
        </>
    );
};

export default UserPersonalDetailsForm;
