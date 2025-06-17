import React from "react";
import { Outlet, useRoutes } from "react-router";
import AccountUserList from "../users/AccountUserList";
import ScaffoldWithSideBar from "../../layout/scaffold/ScaffoldWithSideBar";
import UserProfile from "../users/user-profiles/UserProfile";
import { apiBaseUrl } from "../../../config/constantVariables";
import {
    getRequestTemplate,
    nonGetRequestTemplate,
} from "../../../util-functions/requestTemplates";
import { useAuthenticationContext } from "../authentication/AuthenticationContextProvider";
import ProtectedRoute from "../authentication/ProtectedRoute";
import AppSideBar from "../../layout/sidebars/AppSideBar";
import RestrictedRoute from "../authentication/RestrictedRoute";

export const AccountRoutes = () => {
    const authContext = useAuthenticationContext();
    return {
        path: "account",
        element: (
            <ProtectedRoute>
                <RestrictedRoute adminOnly>
                    <Outlet />
                </RestrictedRoute>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "details",
                loader: async ({ request }) => {
                    return getRequestTemplate(
                        request,
                        `${apiBaseUrl}/api/accounts/${authContext?.userDetails?.account}/`,
                        true
                    );
                },
            },
            {
                path: "users",
                action: async ({ request }) => {
                    return nonGetRequestTemplate(
                        request,
                        `${apiBaseUrl}/api/accounts/${authContext?.userDetails?.account}/users/`,
                        true
                    );
                },
                children: [
                    {
                        index: true,
                        element: <AccountUserList />,
                        loader: async ({ request }) => {
                            return getRequestTemplate(
                                request,
                                `${apiBaseUrl}/api/accounts/${authContext?.userDetails?.account}/users/`,
                                true
                            );
                        },
                    },
                    {
                        path: ":uid",
                        action: async ({ request, params }) => {
                            return nonGetRequestTemplate(
                                request,
                                `${apiBaseUrl}/api/accounts/users/${params.uid}/`,
                                true
                            );
                        },
                        children: [
                            {
                                index: true,
                                element: <UserProfile adminView />,
                                loader: async ({ request, params }) => {
                                    return getRequestTemplate(
                                        request,
                                        `${apiBaseUrl}/api/accounts/users/${params.uid}/`,
                                        true
                                    );
                                },
                            },
                            {
                                path: "change-password",
                                action: async ({ request, params }) => {
                                    return nonGetRequestTemplate(
                                        request,
                                        `${apiBaseUrl}/api/accounts/users/${params.uid}/change-password/`,
                                        true
                                    );
                                },
                            },
                            {
                                path: "set-password",
                                action: async ({ request, params }) => {
                                    return nonGetRequestTemplate(
                                        request,
                                        `${apiBaseUrl}/api/accounts/users/${params.uid}/set-password/`,
                                        true
                                    );
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };
};

const AccountRouter = () => {
    return useRoutes(AccountRoutes());
};

export default AccountRouter;
