import React from "react";
import { useFetcher } from "react-router";
import SelectField from "../../../forms/SelectField";
import Button from "../../../butttons/Button";
import {
    showResponseMessage,
    useMessagesContext,
} from "../../../context-providers/MessagesContextProvider";
import ToggleSwitch from "../../../forms/ToggleSwitch";

const UserRolesForm = ({
    initial,
    userGroupOptions,
    actionUrl,
    allowMultipleRoles = false,
}) => {
    const messagesContext = useMessagesContext();
    const [userDetails, setUserDetails] = React.useState({});
    React.useEffect(() => {
        if (initial) {
            setUserDetails(initial);
        }
    }, [initial]);

    const userDetailsFetcher = useFetcher();
    const [userDetailsErrors, setUserDetailsErrors] = React.useState({});
    const [accountRelationship, setAccountRelationship] =
        React.useState("ORDINARY");

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
        <userDetailsFetcher.Form
            method="patch"
            action={actionUrl}
            className="bg-white shadow-2xs ring-1 ring-gray-900/5 sm:rounded-md"
        >
            <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {Boolean(userGroupOptions?.length > 0) && (
                        <div className="sm:col-span-full">
                            <SelectField
                                label={"User Group"}
                                name={"groups"}
                                error={Boolean(userDetailsErrors.groups)}
                                helpText={
                                    Boolean(userDetailsErrors.groups)
                                        ? userDetailsErrors.groups
                                        : null
                                }
                                options={userGroupOptions}
                                defaultValue={userDetails?.groups}
                                allowMultiple={allowMultipleRoles}
                                allowBlank
                            />
                        </div>
                    )}

                    <div className="sm:col-span-full">
                        <ToggleSwitch
                            label={"Is Admin"}
                            required={false}
                            checked={
                                userDetails?.account_relationship == "ADMIN"
                            }
                            onChange={(value) => {
                                if (value) {
                                    setAccountRelationship("ADMIN");
                                } else {
                                    setAccountRelationship("ORDINARY");
                                }
                            }}
                            error={Boolean(
                                userDetailsErrors.account_relationship
                            )}
                            helpText={
                                Boolean(userDetailsErrors.account_relationship)
                                    ? userDetailsErrors.account_relationship
                                    : "Admin users can manage other users and perform administrative tasks."
                            }
                        />
                        <input
                            type="hidden"
                            name="account_relationship"
                            value={accountRelationship}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <Button type="submit">Save Changes</Button>
            </div>
        </userDetailsFetcher.Form>
    );
};

export default UserRolesForm;
