import React from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import Button from "../../../butttons/Button";
import {
    showResponseMessage,
    useMessagesContext,
} from "../../../context-providers/MessagesContextProvider";
import PageHeader from "../../../layout/headers/PageHeader";
import Container from "../../../layout/Container";
import UserPersonalDetailsForm from "./UserPersonalDetailsForm";
import PasswordChangeForm from "./PasswordChangeForm";
import PasswordSetForm from "./PasswordSetForm";
import UserRolesForm from "./UserRolesForm";
import DeleteButton from "../../../delete-button/DeleteButton";

const UserProfile = ({ adminView = false }) => {
    const messagesContext = useMessagesContext();
    const [userDetails, setUserDetails] = React.useState({});
    const loaderData = useLoaderData();
    const navigator = useNavigate();

    React.useEffect(() => {
        if (
            loaderData !== undefined &&
            loaderData !== null &&
            loaderData.responseCode === 200
        ) {
            setUserDetails(loaderData.responseData.data);
        }
    }, [loaderData]);

    const [accountDetails, setAccountDetails] = React.useState({});
    const accountDetailsFetcher = useFetcher();

    React.useEffect(() => {
        if (accountDetailsFetcher.state === "idle") {
            if (accountDetailsFetcher.data) {
                if (accountDetailsFetcher.data.responseCode === 200) {
                    setAccountDetails(
                        accountDetailsFetcher.data.responseData.data
                    );
                } else {
                    showResponseMessage(
                        accountDetailsFetcher.data,
                        messagesContext
                    );
                }
            } else {
                accountDetailsFetcher.load("/settings/account/details");
            }
        }
    }, [accountDetailsFetcher.data]);

    const [userGroupOptions, setUserGroupOptions] = React.useState([]);

    React.useEffect(() => {
        if (accountDetails?.category_details) {
            let userGroups = [];
            accountDetails?.category_details?.user_groups?.map((group) => {
                userGroups.push({
                    label: group.name,
                    value: group.id,
                });
            });
            setUserGroupOptions(userGroups);
        }
    }, [accountDetails]);

    return (
        <>
            <Container>
                <div className="space-y-8  divide-y divide-gray-900/10">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pb-8">
                        <div>
                            <h2 className="font-semibold">
                                Personal Information
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Update your personal information.
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <UserPersonalDetailsForm
                                initial={userDetails}
                                actionUrl={
                                    Boolean(adminView)
                                        ? `/settings/account/users/${userDetails.uid}`
                                        : `/profile`
                                }
                            />
                        </div>
                    </div>
                    {Boolean(adminView)  && (
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pb-8">
                            <div>
                                <h2 className="font-semibold">User Roles</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Use roles and permissions.
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <UserRolesForm
                                    initial={userDetails}
                                    userGroupOptions={userGroupOptions}
                                    actionUrl={`/settings/account/users/${userDetails.uid}`}
                                />
                            </div>
                        </div>
                    )}

                    {Boolean(!adminView) && (
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pb-8">
                            <div>
                                <h2 className="font-semibold">
                                    Change Password
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Change your old password.
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <PasswordChangeForm
                                    initial={userDetails}
                                    actionUrl={`/profile/change-password`}
                                />
                            </div>
                        </div>
                    )}

                    {Boolean(adminView) && (
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pb-8">
                            <div>
                                <h2 className="font-semibold">
                                    Reset Password
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Reset password.
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <PasswordSetForm
                                    initial={userDetails}
                                    actionUrl={`/settings/account/users/${userDetails?.uid}/set-password`}
                                />
                            </div>
                        </div>
                    )}

                    {Boolean(adminView) && (
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pb-8">
                            <div>
                                <h2 className="font-semibold">Delete</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    This action is not reversible. All
                                    information related to this user will be
                                    deleted permanently.
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <DeleteButton
                                    title="Delete User?"
                                    message="Are you sure you want to delete this user? This action cannot be reversed."
                                    actionUrl={`/settings/account/users/${userDetails?.uid}`}
                                    onSuccess={() => {
                                        navigator(-1);
                                    }}
                                    component={
                                        <Button
                                            color="error"
                                            className="mr-auto"
                                        >
                                            Delete User
                                        </Button>
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default UserProfile;
