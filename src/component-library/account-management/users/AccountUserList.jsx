import React from "react";
import { Link, useFetcher, useLoaderData } from "react-router";
import { PlusIcon } from "@heroicons/react/24/outline";
import FormDialog from "../../forms/FormDialog";
import TableContainer from "../../tables/TableContainer";
import Container from "../../layout/Container";
import TextInput from "../../forms/TextInput";
import EmptyState from "../../utils/EmptyState";
import Button from "../../butttons/Button";
import PageHeader from "../../layout/headers/PageHeader";
import { useAuthenticationContext } from "../authentication/AuthenticationContextProvider";
import {
    showResponseMessage,
    useMessagesContext,
} from "../../context-providers/MessagesContextProvider";
import SelectField from "../../forms/SelectField";
import ToggleSwitch from "../../forms/ToggleSwitch";
import { use } from "react";

const AddUserDialog = () => {
    const messagesContext = useMessagesContext();
    const [errors, setErrors] = React.useState({});
    const [accountRelationship, setAccountRelationship] =
        React.useState("ORDINARY");

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
        <FormDialog
            title="Add User"
            component={
                <Button>
                    <PlusIcon className="h-5 w-5" /> Add User
                </Button>
            }
            actionUrl="/settings/account/users"
            errors={errors}
            setErrors={setErrors}
        >
            <div className="space-y-3">
                <div className="flex space-x-2">
                    <TextInput
                        label={"First Name"}
                        name={"first_name"}
                        error={Boolean(errors.first_name)}
                        helpText={
                            Boolean(errors.first_name)
                                ? errors.first_name
                                : null
                        }
                    />
                    <TextInput
                        label={"Last Name"}
                        name={"last_name"}
                        error={Boolean(errors.last_name)}
                        helpText={
                            Boolean(errors.last_name) ? errors.last_name : null
                        }
                    />
                </div>
                <TextInput
                    label={"Phone Number"}
                    name={"phone_number"}
                    error={Boolean(errors.phone_number)}
                    helpText={
                        Boolean(errors.phone_number)
                            ? errors.phone_number
                            : null
                    }
                />
                <TextInput
                    label={"Email"}
                    name={"email"}
                    required={false}
                    error={Boolean(errors.email)}
                    helpText={Boolean(errors.email) ? errors.email : null}
                />
                <TextInput
                    label={"Username"}
                    name={"username"}
                    error={Boolean(errors.username)}
                    helpText={Boolean(errors.username) ? errors.username : null}
                />
                <TextInput
                    label={"Password"}
                    name={"password"}
                    type={"password"}
                    error={Boolean(errors.password)}
                    helpText={Boolean(errors.password) ? errors.password : null}
                />
                {Boolean(userGroupOptions?.length > 0) && (
                    <SelectField
                        label={"User Role"}
                        name="groups"
                        options={userGroupOptions}
                        error={Boolean(errors.groups)}
                        helpText={Boolean(errors.groups) ? errors.groups : null}
                    />
                )}
            </div>
        </FormDialog>
    );
};

const AccountUserList = () => {
    const authContext = useAuthenticationContext();
    const [users, setUsers] = React.useState([]);
    const loaderData = useLoaderData();

    React.useEffect(() => {
        if (
            loaderData !== undefined &&
            loaderData !== null &&
            loaderData.responseCode === 200
        ) {
            setUsers(loaderData.responseData.data);
        }
    }, [loaderData]);

    const userList = users.filter(
        (user) => user.uid !== authContext?.userDetails?.uid
    );

    return (
        <>
            <Container>
                <TableContainer
                    title={"All Users"}
                    actions={<AddUserDialog />}
                    tableHead={
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left sm:pl-6"
                            >
                                First Name
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left">
                                Last Name
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left">
                                Email
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left">
                                Username
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left">
                                Roles
                            </th>
                            <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                            >
                                <span className="sr-only">Details</span>
                            </th>
                        </tr>
                    }
                    tableBody={
                        Boolean(userList.length > 0) ? (
                            userList.map((user) => (
                                <tr key={user.uid}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {user.first_name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {user.last_name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {user.username}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {Boolean(user.roles.length > 0) ? (
                                            <span>{...user.roles}</span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 flex justify-end text-sm font-medium sm:pr-6">
                                        <Button variant="text">
                                            <Link
                                                to={`/settings/account/users/${user.uid}`}
                                            >
                                                View Details
                                                <span className="sr-only">
                                                    , {user.name}
                                                </span>
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">
                                    <EmptyState
                                        title="No Users"
                                        message={
                                            "No other users found on this account."
                                        }
                                    />
                                </td>
                            </tr>
                        )
                    }
                />
            </Container>
        </>
    );
};

export default AccountUserList;
